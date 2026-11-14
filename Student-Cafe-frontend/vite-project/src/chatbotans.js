const greetings = [
  'Hello! I’m Chai Buddy. Ask me about food, prices, ingredients, deals, or ordering.',
  'Hi there! I’ve got the menu steeping. What can I help you find?',
  'Welcome! Ask away—I know the cafe menu better than I know how to keep my tea hot.',
]

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'about', 'available', 'any', 'can', 'could', 'do', 'does', 'did', 'for', 'from',
  'give', 'have', 'has', 'had', 'hello', 'hey', 'hi', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of',
  'on', 'please', 'show', 'tell', 'the', 'there', 'this', 'to', 'u', 'want', 'was', 'we', 'what', 'which',
  'with', 'would', 'you', 'your', 'price', 'cost', 'much', 'how', 'ingredients', 'ingredient', 'made', 'contains',
  'contain', 'inside', 'include', 'includes', 'menu', 'item', 'items', 'food', 'dish', 'do', 'got', 'get',
  's', 't', 'whats', 'recommend', 'recommendation', 'recommendations', 'suggest', 'suggestion', 'suggestions', 'best', 'popular', 'cheap', 'cheapest', 'affordable', 'budget', 'something',
  'called', 'named', 'looking', 'find', 'guys', 'they', 'them', 'sell', 'serve', 'offer', 'present', 'order', 'ordering', 'stock',
  'where', 'when', 'why', 'who', 'open', 'hours', 'opening', 'timing', 'location', 'address', 'contact', 'phone', 'number', 'whatsapp', 'email', 'website', 'site', 'cart', 'checkout', 'favorite', 'favorites', 'favourite', 'favourites',
])
const genericFoodWords = new Set(['burger', 'pizza', 'drink', 'tea', 'coffee', 'rice', 'chicken', 'beef', 'fish', 'fries', 'roll', 'shawarma', 'deal', 'platter'])

export const normalizeChatText = (value = '') => value
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\bcheeseburger\b/g, 'cheese burger')
  .replace(/\bburgers\b/g, 'burger')
  .replace(/\bpizzas\b/g, 'pizza')
  .replace(/\bplatters\b/g, 'platter')
  .replace(/\bdrinks\b/g, 'drink')
  .replace(/\brolls\b/g, 'roll')
  .replace(/\bfries\b/g, 'fries')

const words = (value) => normalizeChatText(value).split(' ').filter(Boolean)
const meaningfulWords = (value) => words(value).filter((word) => !stopWords.has(word))

function editDistance(left, right) {
  if (left === right) return 0
  if (!left.length) return right.length
  if (!right.length) return left.length
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row]
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[right.length]
}

function correctionDistance(left, right) {
  if (left.length === right.length) {
    const differentIndexes = []
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) differentIndexes.push(index)
    }
    if (
      differentIndexes.length === 2 &&
      differentIndexes[1] === differentIndexes[0] + 1 &&
      left[differentIndexes[0]] === right[differentIndexes[1]] &&
      left[differentIndexes[1]] === right[differentIndexes[0]]
    ) return 1
  }
  return editDistance(left, right)
}

function autocorrectQuery(query, menuItems, ingredients) {
  const vocabularyCounts = new Map()
  const siteText = [
    ...menuItems.flatMap((item) => [item.name, item.category, item.description, item.tag, ...(item.includes || [])]),
    ...Object.entries(ingredients).flatMap(([itemName, parts]) => [itemName, ...parts]),
    'hello hi hey menu price cost ingredients ingredient burger pizza chicken beef wrap shawarma roll tea coffee deals platter order delivery favorites where when why who open hours opening timing location address contact phone number whatsapp email website site cart checkout favorite favourite',
  ].filter(Boolean)

  siteText.flatMap(words).forEach((word) => {
    if (word.length >= 4) vocabularyCounts.set(word, (vocabularyCounts.get(word) || 0) + 1)
  })

  const vocabulary = [...vocabularyCounts.keys()]
  return words(query).map((word) => {
    if (word.length < 4 || vocabularyCounts.has(word) || stopWords.has(word)) return word
    const maxDistance = word.length >= 7 ? 2 : 1
    const closeWords = vocabulary
      .map((candidate) => ({ candidate, distance: correctionDistance(word, candidate), count: vocabularyCounts.get(candidate) }))
      .filter(({ distance }) => distance > 0 && distance <= maxDistance)
      .sort((left, right) => left.distance - right.distance || right.count - left.count)
    if (!closeWords.length || (closeWords[1] && closeWords[1].distance === closeWords[0].distance && closeWords[1].count === closeWords[0].count)) return word
    return closeWords[0].candidate
  }).join(' ')
}

const tokenSimilarity = (left, right) => {
  if (left === right) return 1
  if (left.length >= 4 && right.startsWith(left)) return 0.9
  if (right.length >= 4 && left.startsWith(right)) return 0.88
  const distance = editDistance(left, right)
  if (Math.min(left.length, right.length) >= 5 && distance <= 2) return 0.82
  if (Math.min(left.length, right.length) >= 4 && distance === 1) return 0.78
  return 0
}

const formatPrice = (item, requestedSize = '') => {
  if (item.sizes) {
    const sizeEntry = Object.entries(item.sizes).find(([size]) => normalizeChatText(size) === requestedSize)
    if (sizeEntry) return `${sizeEntry[0]}: Rs. ${Number(sizeEntry[1]).toLocaleString()}`
    return Object.entries(item.sizes).map(([size, amount]) => `${size}: Rs. ${Number(amount).toLocaleString()}`).join(', ')
  }
  if (item.price) return item.price
  if (item.amount) return `Rs. ${Number(item.amount).toLocaleString()}`
  return 'price not listed'
}

const isIngredientQuestion = (query) => /\b(ingredient|ingredients|contain|contains|inside|made of|made with|what s in|what is in|what are in|what goes in|allergen|allergy|allergic)\b|\bdoes\b.*\b(have|has|include|contain)\b/.test(query)
const isPriceQuestion = (query) => /\b(price|cost|how much|rate|rates|rupees|rs)\b/.test(query)
const isFollowUp = (query) => /^(and|what about|how about|what s about|how much|price|ingredients|what s in|what about its|tell me more|more details)\b/.test(query)

function scoreItem(queryTokens, item, exactQuery = '') {
  const nameTokens = words(item.name)
  const normalizedName = normalizeChatText(item.name)
  if (exactQuery && normalizedName.includes(exactQuery)) return 1
  const descriptionTokens = words(`${item.description || ''} ${(item.includes || []).join(' ')}`)
  const specificQuery = queryTokens.filter((token) => !genericFoodWords.has(token))
  const targetTokens = specificQuery.length ? specificQuery : queryTokens
  if (!targetTokens.length) return 0

  const total = targetTokens.reduce((sum, queryToken) => {
    const nameScore = Math.max(0, ...nameTokens.map((itemToken) => tokenSimilarity(queryToken, itemToken)))
    const detailsScore = Math.max(0, ...descriptionTokens.map((itemToken) => tokenSimilarity(queryToken, itemToken))) * 0.72
    return sum + Math.max(nameScore, detailsScore)
  }, 0)
  const coverage = total / targetTokens.length
  const nameCoverage = targetTokens.filter((token) => nameTokens.some((nameToken) => tokenSimilarity(token, nameToken) >= 0.78)).length / targetTokens.length
  return coverage * 0.72 + nameCoverage * 0.28
}

const describeItem = (item) => `${item.name} — ${formatPrice(item)}.${item.description ? ` ${item.description}` : ''}`

export const getChatbotGreeting = () => greetings[Math.floor(Math.random() * greetings.length)]

export function getChatbotReply(question, { menuItems = [], ingredients = {}, lastItemName = '' } = {}) {
  const query = autocorrectQuery(normalizeChatText(question), menuItems, ingredients)
  if (!query) return { text: 'Ask me about a dish, price, ingredient, deal, or how to order.' }
  if (/^(hi|hello|hey|salam|assalam|good morning|good evening|good afternoon)$/.test(query)) return { text: getChatbotGreeting() }
  if (/\b(thank|thanks|shukriya)\b/.test(query)) return { text: 'You’re welcome. Let me know if you need anything else.' }
  if (/\b(who are you|your name|what are you)\b/.test(query)) return { text: 'I’m Chai Buddy, Student Cafe’s menu assistant. I can help with menu items, prices, ingredients, deals, and ordering.' }
  if (/\b(what is student cafe|about student cafe|about this website|what is this website|what does this site do)\b/.test(query)) {
    return { text: 'Student Cafe is an online cafe menu where you can browse fast food, Pakistani dishes, drinks, student deals, and platters. Sign in to save favorites or place an order through your cart.' }
  }
  if (/\b(allergen|allergy|allergic|peanut allergy|nut allergy)\b/.test(query)) {
    return { text: 'I can share the ingredients listed for some burgers and pizzas, but the website doesn’t provide verified allergen or cross-contact information. Please confirm directly with the cafe before ordering: +92 342 696 9696.' }
  }
  if (/\b(opening hours|opening time|hours|timing|when do you open|when are you open)\b/.test(query)) {
    return { text: 'Student Cafe is open daily from 10:00 AM to 10:00 PM.' }
  }
  if (/\b(where|location|address|contact|phone|number|whatsapp|email)\b/.test(query) && !/\b(email|whatsapp)\b.*\b(order|send)\b/.test(query)) {
    return { text: 'Student Cafe is at College Town Plaza, opposite Government Post Graduate College, College Town, Pindi Road, Kohat. WhatsApp: +92 342 696 9696. Email: muzammilshah1st@gmail.com.' }
  }
  if (/\b(how to order|how do i order|place an order|ordering|delivery|pickup|pick up)\b/.test(query)) {
    return { text: 'Add items to your cart, then choose the WhatsApp or email order option. The cafe will confirm pickup or delivery with you.' }
  }
  if (/\b(favorite|favourite|save for later|wishlist)\b/.test(query)) {
    return { text: 'Use the heart on a menu card to save a favorite. You’ll need to sign in to use favorites.' }
  }
  if (/\b(cart|shopping cart|checkout)\b/.test(query)) {
    return { text: 'Add dishes with the Add to cart button. Sign in to place an order, then choose WhatsApp or email from your cart.' }
  }

  const broadAvailabilityQuestion = /\b(what do you have|what can i get)\b/.test(query) && meaningfulWords(query).length === 0
  const categoryIntent = /\b(menu|categories|what food|what do you serve|what do you sell|menu sections)\b/.test(query) || broadAvailabilityQuestion
  if (categoryIntent) {
    const categories = [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
    return { text: `The menu includes ${categories.join(', ')}. Ask about any dish or category and I’ll help you find its details.` }
  }

  const recommendationIntent = /\b(recommend|recommendation|suggest|best|popular|cheap|cheapest|affordable|budget)\b/.test(query)
  if (!recommendationIntent && !isPriceQuestion(query) && /\b(student deals|deals|special offers|combos)\b/.test(query)) {
    const category = /\b(platter)\b/.test(query) ? 'Platters' : 'Student Deals'
    const options = menuItems.filter((item) => item.category === category)
    if (options.length) return { text: `${category}: ${options.map((item) => `${item.name} (${formatPrice(item)})`).join('; ')}.` }
  }

  if (recommendationIntent) {
    const queryWords = meaningfulWords(query)
    const inferredCategory = queryWords.includes('deal') ? 'Student Deals' : queryWords.includes('platter') ? 'Platters' : ''
    const category = inferredCategory || [...new Set(menuItems.map((item) => item.category).filter(Boolean))].find((name) => {
      const categoryWords = meaningfulWords(name)
      return categoryWords.length && categoryWords.every((word) => queryWords.includes(word))
    })
    const candidates = menuItems
      .filter((item) => (!category || item.category === category) && Number(item.amount) > 0)
      .sort((left, right) => Number(left.amount) - Number(right.amount))
      .slice(0, 3)
    if (candidates.length) return { text: `For a lower-priced choice${category ? ` in ${category.toLowerCase()}` : ''}, consider ${candidates.map((item) => `${item.name} (${formatPrice(item)})`).join(', ')}.` }
  }

  const queryTokens = meaningfulWords(query)
  let targetItem = null
  const sizeWords = new Set(['small', 'medium', 'large', 'full', 'half', 'single', 'double', 'regular', 'xl'])
  const requestedSize = queryTokens.find((token) => sizeWords.has(token)) || ''
  const explicitItemTokens = queryTokens.filter((token) => !['ingredient', 'ingredients', 'contain', 'contains', 'inside', 'made', 'with', 'what', 'price', 'cost', 'much', 'available', 'present', 'have', 'does', 'do', 'you', 'is', 'in', 'of', 'the', 'a', 'an', 'and', 'for', 'list', 'show', 'include', 'includes', ...sizeWords].includes(token))
  const categoryAliases = { burger: 'Burgers', pizza: 'Pizza', deal: 'Student Deals', platter: 'Platters', shawarma: 'Shawarma', roll: 'Rolls' }
  const requestedCategory = explicitItemTokens.map((token) => categoryAliases[token]).find(Boolean)
  const directItem = menuItems.find((item) => normalizeChatText(item.name) === explicitItemTokens.join(' '))
  const exactCategory = [...new Set(menuItems.map((item) => item.category).filter(Boolean))].find((category) => {
    const categoryTokens = meaningfulWords(category)
    return categoryTokens.length === explicitItemTokens.length && categoryTokens.every((token) => explicitItemTokens.includes(token))
  })
  if (!directItem && exactCategory && !isIngredientQuestion(query) && !isPriceQuestion(query)) {
    const categoryItems = menuItems.filter((item) => item.category === exactCategory).slice(0, 8)
    const itemList = categoryItems.map((item) => `${item.name} (${formatPrice(item)})`).join('; ')
    const more = menuItems.filter((item) => item.category === exactCategory).length > categoryItems.length ? ' Ask about one item for full details.' : ''
    return { text: `Here are some ${exactCategory.toLowerCase()} options: ${itemList}.${more}` }
  }
  targetItem = directItem || null
  const matchedByQuestion = menuItems
    .filter((item) => !requestedCategory || item.category === requestedCategory)
    .map((item) => ({ item, score: scoreItem(explicitItemTokens, item, explicitItemTokens.join(' ')) }))
    .filter(({ score }) => score >= 0.5)
    .sort((left, right) => right.score - left.score)

  if (matchedByQuestion.length) {
    const top = matchedByQuestion[0]
    const next = matchedByQuestion[1]
    const clearWinner = !next || top.score - next.score >= 0.18
    const strongNameMatch = top.score >= 0.9 && (!next || top.score - next.score >= 0.08)
    if (!targetItem && (clearWinner || strongNameMatch)) targetItem = top.item
    else if (!targetItem && !isFollowUp(query)) {
      const shortlist = matchedByQuestion.slice(0, 3).map(({ item }) => item.name)
      return { text: 'I found a few close matches. Which one did you mean?', options: shortlist }
    }
  }

  const categoryNames = [...new Set(menuItems.map((item) => item.category).filter(Boolean))]
  const categoryMatch = categoryNames.find((category) => {
    const categoryTokens = meaningfulWords(category)
    return categoryTokens.length && categoryTokens.length === queryTokens.length && categoryTokens.every((token) => queryTokens.includes(token))
  })
  if (categoryMatch && !isIngredientQuestion(query) && !isPriceQuestion(query)) {
    return { text: `Yes, we have ${categoryMatch}. Is there a particular item you’d like to know about?` }
  }

  if (!targetItem && isFollowUp(query) && lastItemName) {
    targetItem = menuItems.find((item) => item.name === lastItemName) || null
  }

  if (targetItem) {
    const asksIngredients = isIngredientQuestion(query) || (isFollowUp(query) && /\b(ingredient|what s in|what is in|contain|inside)\b/.test(query))
    if (asksIngredients) {
      const itemIngredients = ingredients[targetItem.name]
      const mentionedIngredient = explicitItemTokens.filter((token) => !words(targetItem.name).includes(token))
      if (mentionedIngredient.length && itemIngredients?.length) {
        const containsIngredient = itemIngredients.some((ingredient) => mentionedIngredient.some((token) => words(ingredient).some((word) => tokenSimilarity(token, word) >= 0.78)))
        const ingredientName = mentionedIngredient.join(' ')
        return { text: containsIngredient ? `Yes. ${targetItem.name} includes ${ingredientName}.` : `The listed ingredients for ${targetItem.name} don’t include ${ingredientName}.`, itemName: targetItem.name }
      }
      return {
        text: itemIngredients?.length
          ? `${targetItem.name} includes ${itemIngredients.join(', ')}.`
          : `A detailed ingredient list for ${targetItem.name} isn’t listed. ${targetItem.description || ''}`.trim(),
        itemName: targetItem.name,
      }
    }
    if (isPriceQuestion(query) || requestedSize) {
      return { text: `${targetItem.name} is ${formatPrice(targetItem, requestedSize)}.`, itemName: targetItem.name }
    }
    if (targetItem.includes?.length) {
      return { text: `${targetItem.name} costs ${formatPrice(targetItem)} and includes ${targetItem.includes.join(', ')}.`, itemName: targetItem.name }
    }
    return { text: describeItem(targetItem), itemName: targetItem.name }
  }

  if (matchedByQuestion.length) {
    const shortlist = matchedByQuestion.slice(0, 3).map(({ item }) => item.name)
    return { text: 'I couldn’t match that exactly. These are the closest menu options. Is one of them what you meant?', options: shortlist }
  }

  if (lastItemName && isFollowUp(query)) {
    return { text: `I can help with ${lastItemName}. Would you like its price, ingredients, or description?`, itemName: lastItemName }
  }

  if (queryTokens.length) return { text: 'I couldn’t find a close match in the menu. Try a shorter name or ask about a category, such as burgers, pizza, drinks, or deals.' }
  return { text: 'I can help with the menu, prices, ingredients, deals, favorites, and ordering. What would you like to know?' }
}

export function getChatbotAnswer(question, menuItems, ingredients = {}) {
  return getChatbotReply(question, { menuItems, ingredients }).text
}
