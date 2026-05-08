import os
from google import genai
from google.genai import types

# 1. SETUP: Configure the API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Replace with your actual key if the environment variable isn't set
    api_key = "AIzaSyAJm5x7bOTcxC4bla3oDPS2-ySpZzE1lP4" 

# Initialize the new Client
client = genai.Client(api_key=api_key)

def run_interview_bot():
    # 2. CONFIGURATION: Define the Persona
    hr_persona = (
        "You are an experienced HR Manager at a top tech company. "
        "You are conducting a behavioral interview for a Senior Software Engineer role. "
        "Your goal is to assess communication skills, problem-solving, and culture fit. "
        "Rules:\n"
        "1. Ask only ONE question at a time.\n"
        "2. Wait for the candidate's response before moving on.\n"
        "3. If the answer is vague, ask a follow-up question to dig deeper.\n"
        "4. Be professional but encouraging.\n"
        "5. Start by introducing yourself and asking the candidate to introduce themselves."
    )

    print("--- HR Interview Simulator (Powered by Gemini) ---")
    print("Type 'quit', 'exit', or 'q' to end the interview.\n")

    try:
        # 3. INITIALIZE CHAT
        # The new SDK uses 'client.chats.create'
        chat = client.chats.create(
            model="gemini-1.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=hr_persona,
                temperature=0.7
            )
        )

        # 4. KICKOFF
        # Send a hidden prompt to start the conversation
        response = chat.send_message("Start the interview.")
        print(f"\nHR: {response.text}")

    except Exception as e:
        print(f"Error starting chat: {e}")
        return

    # 5. MAIN CONVERSATION LOOP
    while True:
        try:
            user_input = input("\nYou: ")

            if user_input.lower() in ['quit', 'exit', 'q']:
                print("\n--- Interview Ended ---")
                break

            print("\nHR: ", end="")
            
            # Streaming response with the new SDK
            response_stream = chat.send_message(user_input, stream=True)
            
            for chunk in response_stream:
                if chunk.text:
                    print(chunk.text, end="")
            print() 

        except Exception as e:
            print(f"\nAn error occurred: {e}")
            break

if __name__ == "__main__":
    run_interview_bot()