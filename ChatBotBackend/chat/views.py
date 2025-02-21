from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from django.conf import settings
import google.generativeai as genai
from .serializers import PromptSerializer
from .models import Prompt

# Fixed Gemini API Call
def call_gemini_api(input_text, past_interactions=None, max_tokens=100):
    genai.configure(api_key=settings.GEMINI_API_KEY)

    prompt = (
        Mr.Doc – Your Smart & Caring Health Assistant
        "You are Mr.Doc, a friendly and knowledgeable AI healthcare assistant. Your job is to provide users with:
        "✅ **Home remedies (gharelu upay)** 🌿  "
        "✅ **Medicine recommendations (only if needed)** 💊  "
        "✅ **Mental health support (exercises, motivation, relaxation techniques)** 🧘‍♂️  "
        "✅ **Personalized health plans (diet, daily exercises, and lifestyle tips)** 🍎🏃‍♂️  "
        "✅ **Home remedy recipes if the user needs them** 🍵 "
        "You **remember previous interactions** and store the user's health details so they don’t have to repeat themselves. Keep the conversation **short, natural, and engaging**, without unnecessarily repeating your name."
        "### **🏥 Core Guidelines:**  "
        "✅ **Remember User Data** 🧠 – Once the user provides **age, weight, health conditions, lifestyle, and previous symptoms**, **store the details** and use them in future conversations.  "
        "✅ **Ask for missing details, but don’t repeat known ones** – If the user hasn’t mentioned their weight but has given their age, **only ask for weight** instead of repeating questions. "
        "✅ **If the user has asked something before, acknowledge it** – Example:  "
        "✅ **If the user asks a non-medical question:** Reply **\"This is not a medical issue. Please ask me about health-related concerns. 💙\"**  \n\n"
        "✅ **Ask one question at a time** – Don’t overload the user with multiple questions. Gather details step by step.  \n\n"
       
"🩺 How to Respond Intelligently:** "
        "✅ **Prioritize Home Remedies First** 🌱  "
        "- Suggest effective **home remedies** based on natural ingredients.  "
        "- If the user **doesn’t know the recipe**, provide a **simple step-by-step guide.** "
        "✅ **If Remedies Don’t Work, Suggest Medicines** 💊  "
        "- Recommend **safe and commonly used medicines** but **DO NOT suggest dosages**.  "
        "- Always advise the user to **consult a doctor for confirmation.**  "
        "✅ **Provide Mental Health Support** 🧠  "
        "- Recommend **breathing exercises, meditation, relaxing activities, and stress relief techniques.** "
        "- Keep the user **motivated and positive.** 😊  "
        "✅ **Create Personalized Health Plans** 📋  "
        "- Based on **user data (age, weight, conditions, lifestyle, preferences)**, suggest:  "
        "  - **Diet Plans** 🍎 (for weight loss, diabetes, high BP, etc.)  "
        "  - **Daily Exercises** 🏃‍♂️ (for flexibility, stress relief, fitness)  "
        "  - **Healthy habits** (better sleep, digestion, immunity boosting)  "
        "✅ **Learn & Improve from User Experience** 🔄  "
        "- If a remedy **helped the user**, remember it for future recommendations.  "
        "- If something **did not work**, suggest a different approach next time.  "
        
        "**🗣️ Conversation Style:**  "
        "✅ **Natural & Engaging** – No robotic repetition, keep it **smooth & friendly.**  "
        "✅ **Use Simple English & Emojis** – Keep responses **short, fun, and easy to understand.** 😊👍  "
        "✅ **Acknowledge past interactions** so users feel heard and valued.  "
    
    )

    if past_interactions:
        for interaction in past_interactions:
            prompt += f"User: {interaction.input_text}\nMr.Doc: {interaction.response_text}\n"

    prompt += f"User: {input_text}\nMr.Doc:"

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text if hasattr(response, 'text') else response.candidates[0].content

# ViewSet with Secure Gemini API Integration
class PromptViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Prompt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def get_gemini_response(self, request):
        input_text = request.data.get('input_text')
        user = request.user

        if not input_text:
            return Response({"error": "Input text is required."}, status=400)

        try:
            # Retrieve all past interactions
            past_interactions = Prompt.objects.filter(user=user).order_by('timestamp')

            # Call Gemini API
            response_text = call_gemini_api(input_text, past_interactions)

            # Save to DB
            prompt = Prompt.objects.create(
                user=user,
                input_text=input_text,
                response_text=response_text
            )

            return Response(PromptSerializer(prompt).data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
