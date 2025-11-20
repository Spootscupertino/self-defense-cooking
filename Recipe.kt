package com.example.heardthatsandbox.data

import com.google.gson.annotations.SerializedName

data class Recipe(
    @SerializedName("id")
    val id: String,

    @SerializedName("title")
    val title: String,

    @SerializedName("category")    val category: String,

    @SerializedName("difficulty")
    val difficulty: String,

    @SerializedName("prep_time")
    val prepTime: String,

    @SerializedName("cook_time")
    val cookTime: String,

    @SerializedName("image_url")
    val imageUrl: String,

    @SerializedName("ingredients")
    val ingredients: List<String>,

    @SerializedName("instructions")
    val instructions: List<String>
)
