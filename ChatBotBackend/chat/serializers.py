import openai
from rest_framework import serializers
from .models import Prompt
from django.conf import settings
from accounts.serializers import UserSerializer

class PromptSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Prompt
        fields = '__all__'

        # def create(self, validated_data):
        #     # Generate a response using the Gemini API
        #     response = openai.Completion.create(
        #         engine="text-davinci-002",
        #         prompt=validated_data['prompt'],
        #         max_tokens=1024,
        #         n=1,
        #         stop=None,
        #         temperature=0.5,
        #     )
        #     # Save the response to the database
        #     validated_data['response'] = response.choices[0].text
        #     return ChatMessage.objects.create(**validated_data)

        # def update(self, instance, validated_data):
        #     # Update the prompt and response fields
        #     instance.prompt = validated_data.get('prompt', instance.prompt)
        #     instance.response = validated_data.get('response', instance.response)
        #     instance.save()
        #     return instance

            
            
