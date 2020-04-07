from django.db import models

# Create your models here.

class City(models.Model):
    name = models.CharField("Name", max_length=240)
    latitude = models.DecimalField("Latitude", max_digits=10, decimal_places=4)
    longitude = models.DecimalField("Longitude", max_digits=10, decimal_places=4)
    
    def __str__(self):
        return self.name

class Placetype(models.Model):
    name = models.CharField("Name", max_length=100)

    def __str__(self):
        return self.name

class Cafe(models.Model):
    place_id = models.CharField("PlaceId", max_length=255, primary_key=True)
    name = models.CharField("Name", max_length=255)
    price_level = models.PositiveSmallIntegerField("PriceLevel")
    rating = models.DecimalField("Rating", max_digits=2, decimal_places=1)
    user_ratings_total = models.IntegerField("UserRatingsTotal")
    city = models.ForeignKey("City", on_delete=models.CASCADE)
    placetypes = models.ManyToManyField(Placetype, related_name='type', through='Cafes_Placetypes')

    def __str__(self):
        return self.name

class Cafes_Placetypes(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    placetype = models.ForeignKey(Placetype, on_delete=models.CASCADE)

class Review(models.Model):
    review_id = models.CharField("ReviewId", max_length=255, primary_key=True)
    reviewer = models.CharField("Name", max_length=255)
    datetime = models.CharField("DateTime", max_length=30)
    rating = models.PositiveSmallIntegerField("Rating")
    text = models.TextField("Text")
    cafe = models.ForeignKey("Cafe", on_delete=models.CASCADE)

    def __str__(self):
        return self.reviewer + " said " + self.text + " regarding cafe: " + self.cafe