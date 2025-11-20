package com.example.heardthatsandbox.ui.recipe

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.heardthatsandbox.data.Recipe
import com.example.heardthatsandbox.viewmodel.RecipeViewModel

@Composable
fun RecipeFeedScreen(viewModel: RecipeViewModel) {
    val recipes by viewModel.recipes.collectAsState()

    // The LazyColumn containing our animated recipe cards
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        itemsIndexed(recipes) { index, recipe ->
            // Each card gets its own animation state
            val animatable = remember { Animatable(-500f) }

            // The animation is triggered when the card enters the composition
            LaunchedEffect(Unit) {
                kotlinx.coroutines.delay(index * 100L) // Staggered delay
                animatable.animateTo(
                    targetValue = 0f,
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioMediumBouncy,
                        stiffness = Spring.StiffnessLow
                    )
                )
            }

            // Apply the animation value to the card's position
            RecipeCard(
                recipe = recipe,
                modifier = Modifier.graphicsLayer {
                    translationY = animatable.value
                }
            )
        }
    }
}

@Composable
private fun RecipeCard(recipe: Recipe, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(0.dp)), // Sharp corners
        shape = RoundedCornerShape(0.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF1A1A1A) // Dark charcoal color
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column {
            // Image loaded with Coil
            AsyncImage(
                model = recipe.imageUrl,
                contentDescription = recipe.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentScale = ContentScale.Crop
            )

            Column(modifier = Modifier.padding(16.dp)) {
                // Title
                Text(
                    text = recipe.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                // Category and Difficulty
                Text(
                    text = "${recipe.category} • Difficulty: ${recipe.difficulty}",
                    fontSize = 14.sp,
                    color = Color(0xFF00C853), // Tactical Green accent
                    modifier = Modifier.padding(top = 4.dp)
                )

                // Prep & Cook Times
                Text(
                    text = "Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        }
    }
}
