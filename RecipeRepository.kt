package com.example.heardthatsandbox.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStreamReader

class RecipeRepository(private val context: Context) {

    suspend fun getRecipes(): List<Recipe> {
        return withContext(Dispatchers.IO) {
            try {
                context.assets.open("recipes.json").use { inputStream ->
                    InputStreamReader(inputStream).use { reader ->
                        val recipeListType = object : TypeToken<List<Recipe>>() {}.type
                        Gson().fromJson(reader, recipeListType)
                    }
                }
            } catch (e: Exception) {
                // In a real app, handle this error more gracefully
                e.printStackTrace()
                emptyList()
            }
        }
    }
}
