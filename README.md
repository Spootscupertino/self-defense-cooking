# Self Defense Cooking — Recipe Engine

The public site runs as a static HTML/JS app. Recipes are stored as JSON in the repo.

## How to run locally

1. Install Node.js 20+
2. `npm ci`
3. `npm run validate`
4. `npm run gen:list`
5. Open `index.html` in your browser.

## Recipe schema

Recipe files live at `recipes/<slug>/recipe.json` and are validated against `schemas/recipe.schema.json`.

Required fields: `title`, `yield`, `ingredients`, `directions`.

## Adding a recipe

1. Create a new folder: `recipes/<slug>/`
2. Add `recipe.json` using the schema.
3. Run `npm run validate` and fix any errors.
4. Run `npm run gen:list`.
5. Commit both `recipes/<slug>/recipe.json` and `recipes/list.json`.

## CI

GitHub Actions runs the CI workflow and will fail the build if recipes do not validate.
