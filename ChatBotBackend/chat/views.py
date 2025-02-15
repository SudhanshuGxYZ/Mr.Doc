from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from django.conf import settings
import google.generativeai as genai  # ✅ Corrected import
from .serializers import PromptSerializer
from .models import Prompt


# ✅ Fixed Gemini API Call
def call_gemini_api(input_text, max_tokens=100):
    genai.configure(api_key=settings.GEMINI_API_KEY)

    prompt = (
        f"As a mental health assistant, provide supportive advice and encouragement "
        f"for the following issue: {input_text}. Then, ask two or three precise follow-up "
        f"questions to better understand and help address the user's concerns."
        f"use emoji's to act like a real person is talking to you and keep your responses short and concise."
    )

    model = genai.GenerativeModel("gemini-1.5-flash")  

    response = model.generate_content(prompt)

    return response.text if hasattr(response, 'text') else response.candidates[0].content


# ✅ ViewSet with Secure Gemini API Integration
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
            # ✅ Call Gemini API
            response_text = call_gemini_api(input_text)

            # ✅ Save to DB
            prompt = Prompt.objects.create(
                user=user,
                input_text=input_text,
                response_text=response_text
            )

            return Response(PromptSerializer(prompt).data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)  # ✅ Better error handling
