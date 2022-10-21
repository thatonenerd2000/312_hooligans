from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


origins = [
    # NEED TO MODIFY THIS **SECURITY ISSUE**
    "*"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # NEED TO MODIFY THIS **SECURITY ISSUE**
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/yellow")
def root():
    return {"message": "Yello World"}
