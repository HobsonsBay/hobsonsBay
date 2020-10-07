
module.exports = async (req, res) => {

  let data = {
	categories: categories,
	tips: tipsWebsite,
	stats: stats
  }

  res.status(200).send(data);
};


const categories = [
  {
  	"name": "Reusable items",
  	"colour": "#FCF089"
  },
  {
  	"name": "Beauty",
  	"colour": "#E9D3FF"
  },
  {
  	"name": "Food and drink",
  	"colour": "#FADCDD"
  },
  {
  	"name": 'Home',
  	"colour": "#E2F4FB"
  },
  {
  	"name": 'Shopping',
  	"colour": "#D7E7C3"
  }
]

const tipsWebsite = [
  {
    "category": "Reusable items",
    "title": "Reusable razor",
    "tip": "Where possible, use a reusable razor. All you have to do is replace the blades! It’s not only cost effective, but an environmentally friendlier option too.",
    "credit":"anon -Altona",
    "did_you_know": "An estimated 2 billion disposable razors are thrown away each year?"
  },
  {
    "category": "Reusable items",
    "title": "Gift giving",
    "tip": "Reuse wrapping paper, ribbons and cards from birthdays and Christmas’ for future gift giving!",
    "credit":"anon -Altona",
    "did_you_know": ""
  },
  {
    "category": "Reusable items",
    "title": "Reuse old clothes for cleaning",
    "tip": "Rip up old clothes and use them for cleaning rags around the house – this means less paper towels!",
    "credit":"anon -Altona",
    "did_you_know": "Australians send 85% of the textiles we buy to landfill every year."
  },
  {
    "category": "Reusable items",
    "title": "Create your own zero waste kit",
    "tip": "Fill a reusable shopping bag with reusable items like: a mesh produce bag for your fruit and veg, a refillable water bottle, a coffee keep cup, a portable set of cutlery or utensils including a reusable straw, a handkerchief and/or a cloth napkin.",
    "credit":"anon -Altona",
    "did_you_know": ""
  },
  {
    "category": "Reusable items",
    "title": "Eco-friendly feminine hygiene",
    "tip": "For those using feminine hygiene products, non-disposable options are available too. You can find these in the form of a menstrual cup, reusable fabric pads or menstrual underwear. A low waste option are pads made from cotton or bamboo.",
    "credit":"anon -Altona",
    "did_you_know": ""
  },
  {
    "category": "Reusable items",
    "title": "Reusable nappies",
    "tip": "It’s not all safety pins and folding your own cloth nappies anymore. Modern reusable nappies are convenient, stylish and cheaper to use in the long run. There are also nappy laundry services.",
    "credit":"anon -Altona",
    "did_you_know": ""
  },
  {
    "category": "Reusable items",
    "title": "Reusable food storage bags",
    "tip": "Consider purchasing reusable storage bags or sandwich pockets. They take up less space in the fridge and freezer than containers and are more versatile than plastic. With proper care, these items often last a lifetime.",
    "did_you_know": ""
  },
  {
    "category": "Reusable items",
    "title": "Reusable straws",
    "tip": "Instead of using single-use plastic straws, consider purchasing reusable bamboo, glass, stainless steel and coloured metal or silicone options. Most of these are dishwasher safe.",
    "did_you_know": ""
  },
  {
    "category": "Beauty",
    "title": "Homemade lip scrub",
    "tip": "Make a lip scrub from either one teaspoon of honey or coconut oil and two teaspoons of sugar. Then just massage the mixture into your lips.",
    "did_you_know": ""
  },
  {
    "category": "Beauty",
    "title": "Hair masks at home",
    "tip": "At home hair masks can be made from olive oil and brown sugar, or honey, avocado and coconut oil, or lemon and egg.",
    "did_you_know": ""
  },
  {
    "category": "Beauty",
    "title": "Hydrating face masks",
    "tip": "For hydration, make yourself a choccy face mask from avocado, honey and cocoa powder. For glowing skin, try mashed banana, orange juice and honey.",
    "did_you_know": ""
  },
  {
    "category": "Beauty",
    "title": "At-home natural deodorant",
    "tip": "You can make your own natural deodorant with coconut oil, baking soda and arrowroot powder. Feel free to add any essential oils too for that extra fragrance!",
    "did_you_know": ""
  },
  {
    "category": "Beauty",
    "title": "Package free showers",
    "tip": "Swap out your bottled shampoo, conditioner and body wash containers for low waste options such as shampoo, conditioner or body wash soap bars. It’s a great way to cut down on pesky plastic waste!",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Use all the veg",
    "tip": "When cooking, try and use all of the vegetable. For example, chop and cook broccoli stalks as well as the broccoli head or wash your veggies and keep the skins on to avoid vegetable peel scraps.",
    "did_you_know": "Each year Aussies waste around 7.3 million tonnes of food –  that's about 300kg per person or one in five bags of groceries."
  },
  {
    "category": "Food and drink",
    "title": "Keep greens fresher for longer",
    "tip": "Store your leafy greens or anything that tends to go limp in the fridge in a loosely wrapped damp (but not soaking wet) tea towel. This keeps them fresh and crisp and saves on plastic packaging!",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Food storage",
    "tip": "To store food in the fridge, place a plate over a bowl or a bowl over a plate of leftovers or prepared produce. It won’t be completely airtight, but it’ll be close and help reduce moisture loss.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Say no to bottled water",
    "tip": "Try your best to avoid buying bottled water. Carry around a reusable drink bottle instead.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Grow your own!",
    "tip": "Where possible, grow your own fruit, veggies or herb garden. They don’t have to be big. Having small herb pots in your kitchen will not only save you money, but the plastic store packaging too.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Tea bags to loose leaf",
    "tip": "Drink loose leaf tea, this cuts down on tea bag waste.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Home cooking",
    "tip": "Takeaways are convenient, but cooking at home can be healthier and more cost effective. Bonus, it also reduces plastic take-away waste.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "BYO containers",
    "tip": "Trashlesstakeaway.com.au is great website to use for places like local cafés, restaurants or butchers that allow you to BYO containers when making purchases.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Meat-free Mondays",
    "tip": "Participate in ‘Meat Free Mondays’ or explore eating more plant based food, chowing down on those loose fruit and veg instead.",
    "did_you_know": ""
  },
  {
    "category": "Food and drink",
    "title": "Alternatives to cling wrap",
    "tip": "Instead of using cling wrap, check out other options like reusable silicon food covers or beeswax food wraps.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "No Junk Mail'",
    "tip": "If you no longer need junk mail delivered, remember to pop a ‘no junk mail’ note on your letterbox.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Digital news",
    "tip": "If you are subscribed to a magazine or newspaper, request for them to be sent digitally via email.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Avoid plastic bin liners",
    "tip": "Instead, try alternatives like line your bin with a few sheets of newspaper or using a ‘naked bin’ with no liner at all. Simply hose and wash it out as needed.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Start a compost",
    "tip": "Instead of throwing your leftovers out or filling up your green bin, start your own compost bin or worm farm. For those with pets, there are even composts bins available designed especially for pet poo.",
    "did_you_know": "Sharewaste.com is a great way to recycle kitchen scraps with neighbours who are already composting, worm-farming or keep chickens."
  },
  {
    "category": "Home",
    "title": "Plastic free pet waste",
    "tip": "On the topic of pet waste… instead of using multiple plastic bags to pick up pet poo, try using a pooper scooper, shovel, paper bags or newspaper.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Homemade household cleaners",
    "tip": "If you’ve run out of household cleaner, make your own! Use items such as white vinegar, water, tea tree oil, baking soda and the like.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Waste free BBQs",
    "tip": "A fun alternative to using single-use wooden skewers is using rosemary sprigs. Just remove the leaves and use the central stem or opt for reusable metal skewers which have the advantage of reducing cooking time as the hot metal cooks the inside of the food.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Single-use free baking",
    "tip": "Consider thoroughly greasing baking tins when baking muffins or cupcakes, instead of using single-use muffin cases.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Reuse the al foil",
    "tip": "Aluminium foil can be washed and reused several times before it’s scrunched into a 10cm diameter ball and recycled.",
    "did_you_know": ""
  },
  {
    "category": "Home",
    "title": "Reuse food storage bags",
    "tip": "Instead of throwing ziplock bags out after one use, consider washing and reusing them a few times before disposing of them. You can also purchase reusable silicone storage bags which are much sturdier and long lasting. The best kinds are oven, microwave and dishwasher safe!",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "For the avid reader",
    "tip": "Instead of buying books, purchase e-books or borrow them at your local library.",
    "did_you_know": "Borrowing from the local library supports authors you love just as well as buying their book."
  },
  {
    "category": "Shopping",
    "title": "Why not borrow?",
    "tip": "Instead of purchasing brand new electronics, tools or other infrequently used items, you could borrow from friends, family, neighbours or community tool libraries.",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Mend your clothes",
    "tip": "If you’re the crafty type, mend holes in clothes instead of throwing them out. Or, find a Repair Cafe to learn, share skills and knowledge.",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Don't shop",
    "tip": "Don’t shop at all and use ‘Buy Nothing’ or ‘Freecycle’ websites and Facebook groups.",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Support local",
    "tip": "Shop locally and buy local produce where possible. It's often a great way to find unique items for a gift or for yourself!",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Up for a challenge?",
    "tip": "Put yourself on a spending ban and make do with what you have. You can even try a waste free shop with your reusable shopping bags that consists of no plastic purchasing.",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Mindful shopping",
    "tip": "Be a mindful shopper. If you BYO container and shop at a deli, you may be able to get a wedge of butter and cheese – plastic wrapper free! Same for some of your local bakeries or butchers.",
    "did_you_know": ""
  },
  {
    "category": "Shopping",
    "title": "Bulk shop",
    "tip": "There are many local bulk shops that stock dry food goods, or items such as bulk dishwashing liquid, hand wash, laundry powders, shampoos and the like. Shop local, support local and waste less!",
    "did_you_know": "Bulk shopping means that you can buy as much or as little as you need, saving on cost and packaging."
  }
]


const stats = [{
  "type" : "Food & Garden",
  "stat" : "We’ve diverted 10 tons of valuable compost from going to landfill.\n\nThat is over 300 truckloads a week!",
  "indicator": "up"
},{
  "type" : "Mixed Recycling",
  "stat" : "Contamination is down 10% from February 2020.\n\nLet’s work together to get contamination down to zero!",
  "indicator": "down"
},{
  "type" : "Glass",
  "stat" : "We are still seing people putting lids in their glass bins.\n\nLids must be separated and put in the appropriate bin",
  "indicator": "down"
},{
  "type" : "Rubbish",
  "stat" : "We’ve saved an estimated 2500 tons from landfill since February 2020.\n\nThat’s enough to cover the Altona pier 1m deep!",
  "indicator": "up"
}]
