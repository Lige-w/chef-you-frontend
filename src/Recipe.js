class Recipe {
    constructor(params) {
        this.id = params.id
        this.name = params.name
        this.description = params.description
        this.servings = params.servings
        if (!!params.quantities) {this.ingredients = params.quantities.map(ingredient => new Ingredient(ingredient))}
        if (!!params.instructions) {this.instructions = params.instructions.map(instruction => instruction.description)}
    }

    //render recipe to User Portal
    renderIndex(node) {
        const listItem = document.createElement('li')
        listItem.addEventListener('click', e => this.getRecipe(e))
        node.appendChild(listItem)

        const title = document.createElement('h3')
        title.innerText = this.name
        listItem.appendChild(title)
    }

    getRecipe(e) {
        fetch(`${Page.RECIPES_URL}/${this.id}`)
            .then(resp => resp.json())
            .then(recipe => {
                const newRecipe = new Recipe(recipe)
                newRecipe.render()
            })
    }

    //Render Recipe to recipe show page
    render() {
        const root = document.getElementById('root')
        root.innerHTML = ""

        const pageOne = document.createElement('div')
        pageOne.classList.add('page-one')
        root.appendChild(pageOne)

        const title = document.createElement('h1')
        title.classList.add('page-title')
        title.innerText = this.name
        pageOne.appendChild(title)

        const controlWrapper = document.createElement("div")
        controlWrapper.classList.add('control-wrapper')
        pageOne.appendChild(controlWrapper)

        const editLink = document.createElement('div')
        editLink.classList.add('far', 'fa-edit', 'edit-link')
        editLink.addEventListener('click', e => this.renderEdit(e))
        controlWrapper.appendChild(editLink)

        const deleteLink = document.createElement('div')
        deleteLink.classList.add('fas', 'fa-trash', 'delete-link')
        controlWrapper.appendChild(deleteLink)

        const description = document.createElement('p')
        description.innerText = this.description
        pageOne.appendChild(description)

        const servings = document.createElement('p')
        servings.innerHTML = `<em>Makes ${this.servings} servings</em>`
        pageOne.appendChild(servings)


        const ingredientHeader = document.createElement('h2')
        ingredientHeader.innerText = 'Ingredients'
        pageOne.appendChild(ingredientHeader)

        const ingredients = document.createElement('ul')
        pageOne.appendChild(ingredients)

        this.ingredients.forEach(ingredient => ingredient.renderQuantities(ingredients))

        const pageTwo = document.createElement('div')
        pageTwo. classList.add('page-two')
        root.appendChild(pageTwo)

        const instructionsHeader = document.createElement('h2')
        instructionsHeader.innerText = 'Instructions'
        pageTwo.appendChild(instructionsHeader)

        const instructions = document.createElement('ol')
        pageTwo.appendChild(instructions)

        this.instructions.forEach(instruction => this.renderInstruction(instructions, instruction))

    }

    renderInstruction(node, instruction) {
        const instructionElement = document.createElement('li')
        instructionElement.innerText = instruction
        node.appendChild(instructionElement)
    }

    renderEdit(e) {
        const root = document.getElementById('root')

        const overlay = document.createElement('div')
        overlay.classList.add('overlay')
        root.appendChild(overlay)

        const formWrapper = document.createElement('div')
        formWrapper.classList.add('form-wrapper')
        root.appendChild(formWrapper)

        const pageTitle = document.createElement('h1')
        pageTitle.classList.add('page-title')
        pageTitle.innerText = 'Add A New Recipe'
        formWrapper.appendChild(pageTitle)

        const form = document.createElement('form')
        form.classList.add('recipe-form')
        form.addEventListener('submit', e => this.updateRecipe(e))
        formWrapper.appendChild(form)

        const name = document.createElement('input')
        name.value = this.name
        form.appendChild(name)

        const servingsWrapper = document.createElement('div')
        form.appendChild(servingsWrapper)

        const servings = document.createElement('input')
        servings.type = 'number'
        servings.value = this.servings
        servingsWrapper.appendChild(servings)

        const description = document.createElement('textarea')
        description.value = this.description
        form.appendChild(description)

        const ingredients = document.createElement('ul')
        ingredients.classList.add('form-ingredients')
        form.appendChild(ingredients)

        this.ingredients.forEach(Recipe.addIngredientField)

        User.addIngredientField(e)

        const directions = document.createElement('ol')
        directions.classList.add('form-directions')
        form.appendChild(directions)

        this.instructions.forEach(Recipe.addInstructionField)
        User.addDirectionField(e)

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Add This Recipe'
        form.appendChild(submit)

    }

    //adds fields for existing ingredients on edit page
    static addIngredientField(ingredient) {

        const ingredients = document.querySelector('.form-ingredients')

        const ingredientRow = document.createElement('li')
        ingredientRow.classList.add('ingredient-input')
        ingredients.appendChild(ingredientRow)

        const qty = document.createElement('input')
        qty.type = 'number'
        qty.value = ingredient.amount
        ingredientRow.appendChild(qty)

        const unit = document.createElement('input')
        unit.value = ingredient.unit
        ingredientRow.appendChild(unit)

        const ingredientInput = document.createElement('input')
        ingredientInput.value = ingredient.name
        ingredientRow.appendChild(ingredientInput)
    }

    // adds fields for existing instructions
    static addInstructionField(instruction) {
        const directions = document.querySelector('.form-directions')

        const directionWrapper = document.createElement('li')
        directions.appendChild(directionWrapper)

        const direction = document.createElement('textarea')
        direction.classList.add('direction-input')
        direction.value = instruction
        directionWrapper.appendChild(direction)
    }

    updateRecipe(e) {
        e.preventDefault()

        const body = {
            recipe: {
                user_id: Page.currentUser.id,
                name: e.target[0].value,
                servings: e.target[1].value,
                description: e.target[2].value,
                quantities_attributes: Ingredient.parseFormIngredients(e),
                instructions_attributes: Instruction.parseInstructions(e)
            }
        }

        fetch(`${Page.RECIPES_URL}/${this.id}`, Page.configObj('PATCH', body))
            .then(resp => resp.json)
            .then(recipe => {debugger})
            .catch(console.log)

    }
}