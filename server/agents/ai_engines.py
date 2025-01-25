import os
from dotenv import load_dotenv
load_dotenv()
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
# from langchain_google_genai import ChatGoogleGenerativeAI


class AiEngines:

    """
    AI engines for langchain function calling facility.
    This class provides methods to initialize various AI models.
    """

    @classmethod
    def openai_api(cls) -> ChatOpenAI:
        """
        Initializes the OpenAI API client.
        Returns:
            ChatOpenAI: An instance of the ChatOpenAI model.
        """
        try:
            os.environ["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY")
            llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
            return llm
        except Exception as e:
            print(f"Error initializing OpenAI API: {e}")
            raise

    @classmethod
    def groq_api(cls, model: str = "mixtral-8x7b-32768"):
        """
        Initializes the GROQ API client.
        Args:
            model (str): The model to use for the API.
        Returns:
            ChatGroq: An instance of the ChatGroq model.
        """
        try:
            
            llm = ChatGroq(
                temperature=0,
                groq_api_key=os.environ.get("GROQ_API_KEY"),
                model_name=model,
            )
            # llm = llm.bind_tools(tools)
            return llm
        except Exception as e:
            print(f"Error initializing GROQ API: {e}")
            raise



# llm = AiEngines.groq_api()
#
# print(llm.invoke("What is the capital of france?"))