
from datetime import date
from concurrent.futures import (
    ThreadPoolExecutor,
    as_completed,
    TimeoutError as FuturesTimeoutError
)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.task import Task
from app.dependencies.auth import get_current_user
from app.utils.ai_clients import gemini_client, groq_client

router = APIRouter(prefix="/insights", tags=["AI Productivity Insights"])


def generate_gemini_insights(prompt):
    response = gemini_client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )
    return response.text or "Gemini returned an empty response."


def generate_groq_insights(prompt):
    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content or "Groq returned an empty response."


@router.get("/")
def get_productivity_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id
    ).all()

    total_tasks = len(tasks)
    completed = sum(1 for task in tasks if task.status == "completed")
    pending = sum(1 for task in tasks if task.status == "pending")

    overdue = sum(
        1 for task in tasks
        if task.status == "pending"
        and task.due_date is not None
        and task.due_date < date.today()
    )

    completion_rate = (
        round((completed / total_tasks) * 100, 2)
        if total_tasks > 0 else 0
    )

    task_data = {
        "total_tasks": total_tasks,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "overdue_tasks": overdue,
        "completion_rate": completion_rate
    }

    prompt = f"""
    You are an AI productivity assistant.
    Analyse these task statistics:
    {task_data}

    Provide:
    1. A short productivity summary.
    2. Positive observations.
    3. Areas that need improvement.
    4. Three practical productivity suggestions.

    Use simple and encouraging language.
    Do not invent statistics.
    """

    # Run both AI providers simultaneously
    executor = ThreadPoolExecutor(max_workers=2)

    futures = {
        executor.submit(generate_gemini_insights, prompt): "gemini",
        executor.submit(generate_groq_insights, prompt): "groq"
    }

    results = {
        "gemini": None,
        "groq": None
    }

    try:
        for future in as_completed(futures, timeout=25):
            provider = futures[future]

            try:
                results[provider] = future.result()

            except Exception as e:
                print(f"{provider.upper()} API ERROR:", str(e))

                results[provider] = (
                    "Gemini is temporarily unavailable. Please try again later."
                    if provider == "gemini"
                    else "Groq is temporarily unavailable. Please try again later."
                )

    except FuturesTimeoutError:
        print("AI INSIGHTS: 25-second response timeout.")

    finally:
        executor.shutdown(wait=False, cancel_futures=True)

    if results["gemini"] is None:
        results["gemini"] = "Gemini is taking too long to respond. Please try again later."

    if results["groq"] is None:
        results["groq"] = "Groq is taking too long to respond. Please try again later."

    return {
        "statistics": task_data,
        "gemini_insights": results["gemini"],
        "groq_insights": results["groq"]
    }
