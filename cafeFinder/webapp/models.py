from django.db import models

# Create your models here.

class City(models.Model):
    name = models.CharField("Name", max_length=255)
    latitude = models.DecimalField("Latitude", max_digits=10, decimal_places=8)
    longitude = models.DecimalField("Longitude", max_digits=11, decimal_places=8)
    country = models.ForeignKey("Country", on_delete=models.CASCADE, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Country(models.Model):
    countryCode = models.CharField("CountryCode", max_length=255, default="Unset")


class Placetype(models.Model):
    name = models.CharField("Name", max_length=255)

    def __str__(self):
        return self.name

class Cafe(models.Model):
    place_id = models.CharField("PlaceId", max_length=255, primary_key=True)
    name = models.CharField("Name", max_length=255)
    price_level = models.PositiveSmallIntegerField("PriceLevel", null=True)
    hours = models.CharField("Hours", max_length=255, null=True, default="unset")
    rating = models.DecimalField("Rating", max_digits=2, decimal_places=1, null=True)
    user_ratings_total = models.IntegerField("UserRatingsTotal", null=True)
    address = models.CharField("Addr", max_length=255, default="unset")
    compound_code = models.CharField('CompoundCode', max_length=255, null=True)
    website = models.CharField('Website', max_length=255, null=True)
    city = models.ForeignKey("City", on_delete=models.CASCADE, null=True)
    placetypes = models.ManyToManyField(Placetype, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    review_id = models.CharField("ReviewId", max_length=255, primary_key=True)
    reviewer = models.CharField("Name", max_length=255)
    datetime = models.CharField("DateTime", max_length=30)
    rating = models.PositiveSmallIntegerField("Rating")
    text = models.TextField("Text")
    cafe = models.ForeignKey("Cafe", on_delete=models.CASCADE)

    def __str__(self):
        return self.reviewer + " said " + self.text + " regarding cafe: " + self.cafe
