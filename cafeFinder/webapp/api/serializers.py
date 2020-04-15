"""Serializers repository - convert json to models and vice versa"""
from rest_framework import serializers

from webapp.models import City, Placetype, Cafe, Review, Country


class CitySerializer(serializers.ModelSerializer):
    """City Serializer"""
    class Meta:
        model = City
        # fields = ["name", "latitude", "longitude"]
        fields = "__all__"

class CountrySerializer(serializers.ModelSerializer):
    """Country Serializer"""
    class Meta:
        model = Country
        fields = "__all__"

class PlacetypeSerializer(serializers.ModelSerializer):
    """Placetype Serializer"""
    class Meta:
        model = Placetype
        fields = ["name"]

class CafeSerializer(serializers.ModelSerializer):
    """Cafe Serializer"""
    class Meta:
        model = Cafe
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    """Review Serializer"""
    class Meta:
        model = Review
        fields = ["review_id", "reviewer", "datetime", "rating", "text"]