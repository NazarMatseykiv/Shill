import orderModel from '../models/orderModel.js'
import foodModel from '../models/foodModel.js'

function jaccardSimilarity(setA, setB) {
    const intersection = new Set([...setA].filter(x => setB.has(x)))
    const union = new Set([...setA, ...setB])
    return intersection.size / union.size
}

export async function getRecommendedFoods(userId, limit = 5) {
    const orders = await orderModel.find({})
    const foods = await foodModel.find({})
    const userFoods = {}
    orders.forEach(order => {
        if (!userFoods[order.userId]) userFoods[order.userId] = new Set()
        order.items.forEach(item => {
            userFoods[order.userId].add(item.id)
        })
    })
    const targetFoods = userFoods[userId] || new Set()
    const similarities = []
    for (const otherId in userFoods) {
        if (otherId === userId) continue
        const sim = jaccardSimilarity(targetFoods, userFoods[otherId])
        if (sim > 0) similarities.push({ userId: otherId, sim })
    }
    similarities.sort((a, b) => b.sim - a.sim)
    const recommendedIds = new Set()
    similarities.slice(0, 3).forEach(({ userId: otherId }) => {
        userFoods[otherId].forEach(fid => {
            if (!targetFoods.has(fid)) recommendedIds.add(fid)
        })
    })
    if (recommendedIds.size < limit) {
        const foodCount = {}
        orders.forEach(order => {
            order.items.forEach(item => {
                foodCount[item.id] = (foodCount[item.id] || 0) + (item.count || 1)
            })
        })
        foods.forEach(food => {
            if (!targetFoods.has(food._id.toString())) {
                recommendedIds.add(food._id.toString())
            }
        })
    }
    const recommended = foods.filter(f => recommendedIds.has(f._id.toString())).slice(0, limit)
    return recommended
}
