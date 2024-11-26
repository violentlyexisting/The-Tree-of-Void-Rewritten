/*addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        resetTime: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})*/

function mod(a, b) {/*
    let decA = new Decimal(a); // Convert to Decimal
    let decB = new Decimal(b); // Convert to Decimal*/

    // Perform modulo calculation
    return a.sub(b.mul(a.div(b).floor()));
}

addLayer("sl", {
    name: "sl", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        bestOnReset: new Decimal(0),
        resetTime: 0,
    }},
    color: "#8A2BE2",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource() {
        return "shard(s) of light"
    }, // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        hasMilestone('ef',1)?mult=mult.mul(layers.ef.effect().y):mult
        hasUpgrade('ef',13)?mult=mult.mul(25):mult
        hasUpgrade('ef',14)&&!hasMilestone('ef',3)?mult=mult.div(25):mult
        getBuyableAmount('hs',11).gte(1)?mult=mult.mul(buyableEffect('hs',11).sl):mult
        hasUpgrade('hs',15)?mult=mult.mul(upgradeEffect('hs',15)):mult
        hasUpgrade('ew',24)?mult=mult.mul(tmp.ew.effect.sl):mult
        hasUpgrade('e',11)?mult=mult.mul(upgradeEffect('e',11)):mult
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        hasUpgrade('ef',15)&&!hasUpgrade('sl',15)?exp=exp.div(10).mul(hasUpgrade('hs',25)?upgradeEffect('hs',25):1):exp
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Gather shards of light with your bare hands.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Prestige": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                ["infobox", "NOTloreth"]
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                "blank",
                "upgrades",
                "blank",
                ["infobox", "NOTloreth"]
            ]
        },
        "Light Cores": {
            unlocked() {return hasUpgrade('sl',12)?true:false},
            content: [
                "main-display",
                ["infobox", "loreth"],
                "blank",
                ["buyable", 11],
                "blank",
                "milestones",
                "blank",
                ["infobox", "NOTloreth"]
            ],
        },
        "The Limbo Page": {
            content: [
                ["clickable", 11],
                ["row", [["clickable", 14], ["clickable", 13], ["clickable", 12]]],
                "blank",
                ["clickable",16],
                ["clickable",17],
                ["clickable",18],
                ["clickable",19],
            ]
        }
    },
    microtabs:{
        main: {
            "Prestige": {
                content:[
                    "main-display",
                    "prestige-button",
                    "blank",
                    "resource-display"
                ]
            },
            "Upgrades": {
                content:[
                    "main-display",
                    "blank",
                    "upgrades",
                ]
            }
        }
    },
    layerShown(){return true},
    upgrades: {
        11: {
            title: "The Beginning",
            description: "You generate more points based on best shards of light.",
            cost() {
                let x = player.sl.points
                if (hasUpgrade('sl', 11)) x = x.pow(4.4)
                return x.max("1").min("1e500")
            },
            effect() {
                let amt = new Decimal(3)
                getBuyableAmount('sl',11).gte(2)?amt=amt.add(4):amt
                let x = player.sl.best.min(amt).add(1).pow(1.2)
                let y = player.sl.best.sub(amt).add(1).pow(0.66).log(2).add(1)
                //if (player.sl.best.gte(3)) x = x.mul(y)
                player.sl.best.gte(amt)?x=x.mul(y):x
                hasUpgrade('ef',15)?x=x.mul(hasUpgrade('sl',15)?"1e10":100).pow(hasUpgrade('sl',15)?2:1.5):x
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('sl', 11)) + "x"
            }
        },
        12: {
            title: "Awakening",
            description: "Unlock light cores and multiply points.",
            cost() {/*
                if (!hasUpgrade('sl', 12)) return new Decimal(3)
                else return player.sl.points.mul(player.sl.resetTime).pow(33);*/
                return hasUpgrade('sl', 12)?player.sl.points.mul(player.sl.resetTime).pow(33):new Decimal(3);
            },
            effectDisplay() {
                return hasUpgrade('sl', 15)&&hasUpgrade('ef',15)?"1.00e50x":"10.00x"}
        },
        13: {
            title: "Echoic Surge",
            description: "Echo Fragments boost points.",
            cost: new Decimal("1e450"),
            effect() {
                let x = player.ef.points.pow(2).add(1).log(1000).pow(100).add(1)
                if (hasUpgrade('e',22)) x = x.pow(2)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('sl',13))}x`
            },
            style() {
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? 
                    "linear-gradient(to right, #9b358f 15%, #b38ec8 40%, #c58ae6 60%, #7b4fa6)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#b296d1" : "#8d62ac"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
        },
        14: {
            title: "Resonant Whispers",
            description: "Fading Whispers' point boost is improved with Echo Fragments.",
            cost: new Decimal("1e790"),
            effect() {
                let x = player.ef.points.add(1).log(2000).pow(80).add(1)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect(this.layer, this.id))}x`
            },
            style() {
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? 
                    "linear-gradient(to right, #9b358f 15%, #b38ec8 40%, #c58ae6 60%, #7b4fa6)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#b296d1" : "#8d62ac"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
        },
        15: {
            title: "Restoration",
            description: `"Redistribution" nerf is disabled, and massively buff its effects.`,
            cost: new Decimal("1e950"),
            style() {
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? 
                    "linear-gradient(to right, #9b358f 15%, #b38ec8 40%, #c58ae6 60%, #7b4fa6)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#b296d1" : "#8d62ac"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
        },
    },
    buyables: {
        11: {
            title: "Light Cores",
            display() {
                let usefulInfo1 = "<br>Also improves Upgrade 1's formula slightly."
                let usefulInfo2 = "<br>Resonance I and II's costs don't increase upon buying the other."
                let usefulInfo3a = "<br>Unlock Echoic Whisper upgrades."
                let usefulInfo3b = "<br>Unlock Harmonic Seeds upgrades."
                return "Multiplies point gain by " + format(buyableEffect('sl', 11).x) + "x and unlocks stuff (and more multipliers respectively)." + "<br>Amount: " + format(getBuyableAmount('sl', 11)) + "<br>Cost: " + formatWhole(tmp['sl'].buyables[11].cost) + " points." + (getBuyableAmount('sl',11).gte(2)?usefulInfo1:"") + (getBuyableAmount('sl',11).gte(3)?usefulInfo2:"") + (getBuyableAmount('sl',11).gte(5)&&player.ew.unlocked?usefulInfo3a:"") + (getBuyableAmount('sl',11).gte(5)&&player.hs.unlocked?usefulInfo3b:"")
            },
            cost() {
                let x = getBuyableAmount('sl',11)
                let base = new Decimal(20000)
                x.gte(10)?x.mul(1.1):x
                hasMilestone('sl', 1)?base=base.sub(2000):base
                return base.pow(x)
            },
            canAfford() {
                return player.points.gte(tmp["sl"].buyables[11].cost)
            },
            buy() {
                player.points = player.points.sub(tmp["sl"].buyables[11].cost)
                setBuyableAmount('sl', 11, getBuyableAmount('sl',11).add(1))
            },
            effect() {
                let a = getBuyableAmount('sl', 11)
                let x = player.sl.points.add(1).log(2).root(25).add(1)
                return {
                    x:x.pow(a)
                }
            }
        }
    },
    milestones: {
        0:{
            requirementDescription: "2 Light Cores",
            effectDescription: "Unlock Echo Fragments, and progress (real.).",
            done() {return getBuyableAmount('sl',11).gte(2)?true:false},
            unlocked() {
                return getBuyableAmount('sl',11).gte(1)?true:false
            }
        },
        1: {
            requirementDescription: "3 Light Cores",
            effectDescription: "This is the discount of All Time. (Base cost decreases from 20000^x to 18000^x)",
            done() {return getBuyableAmount('sl',11).gte(3)?true:false},
            unlocked() {
                return getBuyableAmount('sl',11).gte(2)?true:false
            }

        }
    },
    infoboxes: {
        'loreth': {
            title: "This is the lore of All Time",
            body() {return `Once upon a time, there existed a realm beyond our universe, a place of eternal peace and harmony where its citizens knew nothing of ‘sin’ or ‘evil.’ It was a world so pure that one might call it paradise. Yet, its perfection was not born from an inability to do wrong but from the absence of awareness of such concepts. After all, in a world without suffering, what need would there be for the knowledge of evil?`}
        },
        'NOTloreth': {
            title: "You Look Like You're Lost",
            body() {return `You don't actually have to get that many shards of light! I know, timewalls suck, but you have to be patient because despite the "extra" bonus you're getting, you're actually losing valuable time which could get you to the next step.<br><br><b>TL;DR: Don't spend too much time on getting prestige currency if the next step is waiting to progress.`},
            unlocked() {
                return player.sl.points.gte(250)?!hasMilestone('ef', 1)?true:false:false
            }
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('ef', 0) || hasMilestone('hs',1)) {
            keep.push("upgrades");
            keep.push("milestones")
            keep.push("buyables")
        }
        if (layers[resettingLayer].row > this.row) {
            let data = layerDataReset("sl", keep)
        }
    },
    passiveGeneration() {
        return hasMilestone('ef', 2)?1:0
    },
    clickables: {
        11: {
            title: "reset",
            display() {return "Force an EF reset. Because I said so."},
            canClick() {return true},
            onClick() {
                doReset('ef', true)
            },
            style: {
                "background":"#6B8E23"
            }
        },
        12: {
            title: "reset",
            display() {return "Force an HS reset. Because I said so."},
            canClick() {return true},
            onClick() {
                doReset('hs', true)
                player.ef.upgrades.push(15)
                player.hs.length = new Decimal(0)
            },
            style: {
                "background":"radial-gradient(#66cc66, #9966cc)"
            },
            unlocked() {return player.hs.unlocked},
        },
        13: {
            title: "reset",
            display() {return "Force an E reset. Because I said so."},
            canClick() {return true},
            onClick() {
                doReset('e', true)
            },
            style: {
                "background":"linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)",
                "background-position": "calc(50% - 5px) center",
                "background-size": "120% 100%"
            },
            unlocked() {return player.e.unlocked},
        },
        14: {
            title: "reset",
            display() {return "Force an EW reset. Because I said so."},
            canClick() {return true},
            onClick() {
                doReset('hs', true)
                player.ef.upgrades.push(15)
                let x = player.ew.points.min(1e5).pow(2)
                let xsoftcap = player.ew.points.sub(1e5).pow(1.2)
                player.ew.points.gte(1e5)?x=x.mul(xsoftcap):x
                player.ew.fw = x
            },
            style: {
                "background":"radial-gradient(#00ffff, #ff0000)"
            },
            unlocked() {return player.ew.unlocked},
        },
        16: { // if this is still 14 or 16 i'm gonna have to change it when i add new layers
            title: "Skip SL",
            display() {
                return "Get all SL upgrades, 1e5 points and 2 light cores using the magical power of code."
            },
            canClick() {
                return true
            },
            onClick() {
                player.sl.upgrades = [11, 12]
                player.points = new Decimal(1e5)
                setBuyableAmount('sl',11, new Decimal(2))
            },
            style: {
                "width": "500px",
                "min-height": "50px",
            }
        },
        17: { // if this is still 15 or 17 i'm gonna have to change it when i add new layers
            title: "Skip EF",
            display() {
                return "Get all EF upgrades and milestones, 1e6 EF points and 3 light cores using the magical power of code."
            },
            canClick() {
                return true
            },
            onClick() {
                player.points = new Decimal(1e5)
                doReset('ef')
                player.sl.upgrades = [11, 12]
                player.sl.points = new Decimal(500)
                player.ef.upgrades = [11, 12, 13, 14, 15]
                player.ef.milestones = [0, 1, 2, 3]
                player.ef.points = new Decimal(1e6)
                player.ef.best = player.ef.points
                player.ef.total = new Decimal(1e6)
                player.ef.unlocked = true
                setBuyableAmount('sl',11, new Decimal(3))
            },
            style: {
                "width": "500px",
                "min-height": "50px",
                "background":"#6B8E23",
            }
        },
        18: { // if this is still 15 or 17 i'm gonna have to change it when i add new layers
            title: "Skip EW",
            display() {
                return "Get all EW upgrades and milestones, 1.00e32 EF points and 1.00e80 FW using the magical power of code."
            },
            canClick() {
                return true
            },
            onClick() {
                doReset('ew')
                player.sl.upgrades = [11, 12]
                player.ef.upgrades = [11, 12, 13, 14, 15]
                player.ef.milestones = [0, 1, 2, 3]
                player.ew.upgrades = [11, 12, 13, 14, 15, 21, 22, 23, 24]
                player.ew.milestones = [0, 1, 2]
                player.ew.points = new Decimal(1e32)
                player.ew.best = new Decimal(1e32)
                player.ew.total = new Decimal(1e32)
                player.ew.fw = new Decimal(1e80)
                player.ef.unlocked = true
                player.ew.unlocked = true
                player.ew.unlockOrder = 0
                setBuyableAmount('sl',11, new Decimal(24))
            },
            style: {
                "width": "500px",
                "min-height": "50px",
                "background":"radial-gradient(#00ffff, #ff0000)",
            }
        },
        19: { // if this is still 15 or 17 i'm gonna have to change it when i add new layers
            title: "Skip HS",
            display() {
                return "Get <small>almost</small> all HS upgrades and milestones, 12 HS points, all branches and 12 spent seeds using the magical power of code."
            },
            canClick() {
                return true
            },
            onClick() {
                player.sl.points = new Decimal(500)
                doReset('hs')
                player.sl.upgrades = [11, 12]
                player.ef.upgrades = [11, 12, 13, 14, 15]
                player.ef.milestones = [0, 1, 2, 3]
                player.hs.upgrades = [11, 12, 13, 14, 15, 21, 22, 23, 24]
                player.hs.milestones = [0, 1, 2]
                player.hs.points = new Decimal(12)
                player.hs.best = player.hs.points
                player.hs.total = new Decimal(57)
                player.hs.spentseeds = new Decimal(12)
                player.ef.unlocked = true
                player.hs.unlocked = true
                player.hs.unlockOrder = 0
                setBuyableAmount('sl',11, new Decimal(24))
                setBuyableAmount('hs',11, new Decimal(3))
            },
            style: {
                "width": "500px",
                "min-height": "50px",
                "background":"radial-gradient(#66cc66, #9966cc)",
            }
        },
    },
    update() {
        player.ew.auto?buyBuyable('sl',11):player.points
    }
})

addLayer("ef", {
    name: "echo", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        bestOnReset: new Decimal(0),
        resetTime: 0,
    }},
    color: "#6B8E23",
    requires: new Decimal(1e5), // Can be a function that takes requirement increases into account
    resource: "echo fragment(s)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        hasUpgrade('ef',12)?mult=mult.mul(1.99):mult
        hasUpgrade('ef',15)?mult=mult.pow(hasUpgrade('sl',15)?2:1.4):mult
        getBuyableAmount('hs',11).gte(2)?mult=mult.mul(buyableEffect('hs',11).ef):mult
        hasUpgrade('e',22)?mult=mult.mul(upgradeEffect('e',22)):mult
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: i dont know uh whatdoisayherehelp, Reset for Echo Fragments", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('sl',0)||player.ef.unlocked?true:false},
    effectDescription() {
        let info = "which do absolutely nothing."
        let info2 = "which raises point gain by ^" + format(player.points.pow(0.8).mul(2))
        let x = player.ef.points.min(100).div(2).floor()
        let y = x.mul(2)
        let z = player.ef.points.sub(y)
        return z.eq(0)?info:info2
    },
    tabFormat: {
        main: {
            content: [
                ["infobox", "lorethpt2"],
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "milestones",
                "blank",
                ["infobox", "NOTlorethpt2"],
                "blank",
                ["clickable", 11],
                "upgrades",
            ]
        }
    },
    branches:['sl'],
    milestones: {
        0: {
            requirementDescription: "2 total echo fragments",
            effectDescription: "Allows you to keep SL milestones and upgrades on this layer only.",
            done() { return player.ef.total.gte(2)?true:false }
        },
        1: {
            requirementDescription: "3 total echo fragments",
            effectDescription() { return "Echo fragment amount ACTUALLY does something (Multiply point gain by " + format(layers.ef.effect().x) + "x and SL gain by " + format(layers.ef.effect().y) + "x)"},
            done() { return player.ef.total.gte(3)?true:false }
        },
        2: {
            requirementDescription: "10 total echo fragments",
            effectDescription: "Allow passive generation of SL.",
            done() { return player.ef.total.gte(10)?true:false}
        },
        3: {
            requirementDescription: "200 total echo fragments",
            effectDescription: "Echoic Exchange I and II's nerfs are disabled.",
            done() { return player.ef.total.gte(200)?true:false},
            unlocked() { return player.ef.total.gte(50)?true:false }
        }
    },
    effect() {
        let a = new Decimal(1.25)
        let b = new Decimal(5)
        let x = a.pow(player.ef.points.min(b))
        let y = player.ef.points.add(1).log(2).pow(1.4).pow(hasUpgrade('ew',22)?4:1).add(1)
        let z = player.ef.points.add(1).log10().pow(0.8).pow(hasUpgrade('ew',22)?4:1).add(1)
        hasUpgrade('e',15)?x=player.ef.points.add(1).log(12).pow(player.hs.points.add(1).log(3).pow(4).add(1)).min("1e140").add(1):x
        hasUpgrade('e',15)?z=player.ef.points.add(1).log10().pow(player.hs.points.add(1).log(2).pow(2).add(1)).min("1e120").add(1):z
        let xs = player.ef.points.add(1).log(12).pow(1.2).add(1)
        x.gte("1e140")?x=x.mul(xs):z
        let zs = player.ef.points.add(1).log(12).pow(0.4).add(1)
        z.gte("1e120")?z=z.mul(zs):z
        player.ef.points.gte(b)?x=x.mul(y):x
        return {
            x:x,
            y:z
        }
    },
    upgrades: {
        11:{
            title: "Resonance I",
            description: "Point gain is ^1.05 (and THAT is a huge boost)",
            cost() {
                return hasUpgrade('ef',12)&&!hasMilestone('sl',1)?new Decimal(10):new Decimal(1)
            }
        },
        12:{
            title: "Resonance II",
            description: "EF gain is improved.",
            cost() {
                return hasUpgrade('ef',11)&&!hasMilestone('sl',1)?new Decimal(10):new Decimal(1)
            },
            effectDisplay: "1.99x"
        },
        13: {
            title: "Echoic Exchange I",
            description: "Point gain is divided by 10.00, but SL gain is 25.00x",
            cost() {
                return hasUpgrade('ef',14)?new Decimal(50):new Decimal(3)
            }
        },
        14: {
            title: "Echoic Exchange II",
            description: "Point gain is 10.00x, but SL gain is divided by 25.00",
            cost() {
                return hasUpgrade('ef',13)?new Decimal(50):new Decimal(3)
            }
        },
        15: {
            title: "Redistribution",
            description: "SL gain exponent is heavily nerfed, but point and EF gains are equally improved.",
            cost: new Decimal(500),
            onPurchase() {
                doReset('ef', true)
            }
        }
    },
    clickables: {
        11: {
            title: "Upgrades",
            display() {return "Upgrades are unbought (and force an EF reset bc otherwise that'd be cheating)."},
            canClick() {
                return true
            },
            onClick() {
                doReset('ef', true)
                player.ef.upgrades = []
            }
        }
    },
    infoboxes: {
        "lorethpt2": {
            title: "This is ALSO the Lore of All Time",
            body: `The Void wasn’t always known as ‘The Void.’ It was once a place of serenity called ‘Luminara.’ In this utopia, the world was pure and free of evil. However, the seeds of ruin lay hidden within: unbridled ambition could twist into greed, innocent desires into lust, and steadfast hope into delusion. These flaws, though dormant, carried the potential for a catastrophic downfall.`
        },
        "NOTlorethpt2": {
            title: "You Look Like You're Lost",
            body: `Echoic Exchange I is bad right now. Unupgrade your upgrades and buy the other one.`,
            unlocked() {
                return hasUpgrade('ef',13)&&!hasMilestone('ef',3)
            }
        }
    },    
    doReset(resettingLayer) {
        let keep = [];
        //keep.push("upgrades")
        if (hasMilestone('hs', 0) && resettingLayer == "hs" || hasMilestone('ew', 0) && resettingLayer == "ew" || hasMilestone('e', 0) && resettingLayer == "e") { 
            keep.push("milestones")
        }
        if (hasMilestone('hs', 1) && resettingLayer == "hs" || hasMilestone('ew', 1) && resettingLayer == "ew" || hasMilestone('e', 0) && resettingLayer == "e") { 
            keep.push("upgrades")
        }
        let keep2 = [15]
        if (layers[resettingLayer].row > this.row) { 
            layerDataReset("ef", keep) //anything that goes in data can help specify what thing u wanna keep
            //YES I TOOK THIS FUCKING LONG TO FIGURE IT OUT BUT HAHAHAHA NOW IM NOT ANYMORE HAHAHAHAHAHAHAHAHA
            //WHEN I UPLOAD THIS SHIT I WILL ALWAYS REMEMBER THIS IS WHERE I DARED TO USE MOST CODE AND NOT HAVE ANYONE DO THINGS FOR ME
            if (!hasMilestone('ew', 2)) {
                // Ensure the upgrades field exists before pushing
                if (!player.ef.upgrades) player.ef.upgrades = [];
                player.ef.upgrades.push(...keep2); // Spread the array to push multiple upgrades
            }
        }           
        //console.log(layerDataReset("ef", keep))
    },
    passiveGeneration() {
        return hasMilestone('hs', 2)?1:0
    },
})

addLayer("ew", {
    name: "whisper", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EW", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        resetTime: 0,
        unlockOrder: 0,
        fw: new Decimal(0),
        auto: false
    }},
    color: "#ff0000",
    requires() {
        return new Decimal(1e14).mul((player.ew.unlockOrder)?1e86:1)
    }, // Can be a function that takes requirement increases into account
    resource: "echoic whisper(s)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        hasUpgrade('ew',12)?mult=mult.mul(tmp.ew.effect.ew):mult
        hasUpgrade('ew',15)?mult=mult.mul(upgradeEffect('ew',15)):mult
        hasUpgrade('e',23)?mult=mult.mul(upgradeEffect('e',23)):mult
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.45)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "w", description: "W: HELP I STILL DONT KNOW HOW TO ACCURATELY LORE'TH THESE Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        return hasUpgrade('ef',15)||player.ew.unlocked||player.hs.unlocked?true:false
    },
    nodeStyle() { return {
        //"background": "linear-gradient(to right, #dc143c, #7f8c8d)",
        "background":(player.ew.unlocked||canReset('ew'))?"radial-gradient(#00ffff, #ff0000)":"#bf8f8f"
        }
    },
    componentStyles: {
        "prestige-button"() {
            return {
                /* this is for reference for a future layer
                "background": "linear-gradient(to left, #ff0000, #00ff00)",
                "background-position": "calc(50% - 5px) center",
                "background-size": "120% 100%",*/
                "background":(canReset('ew'))?"radial-gradient(#00ffff, #ff0000)":"#bf8f8f"
            }
        }
    },
    branches:['ef'],
    increaseUnlockOrder:['hs'],
    onPrestige() {
        let x = player.ew.points.min(1e5).pow(2)
        let xsoftcap = player.ew.points.sub(1e5).pow(1.2).mul(hasUpgrade('ew',23)?upgradeEffect('ew',23):1)
        player.ew.points.gte(1e5)?x=x.mul(xsoftcap):x
        player.ew.fw = x
    },
    effectDescription() {
        let x = player.ew.points.min(1e5).pow(2)
        let xsoftcap = player.ew.points.sub(1e5).pow(1.2).mul(hasUpgrade('ew',23)?upgradeEffect('ew',23):1)
        player.ew.points.gte(1e5)?x=x.mul(xsoftcap):x
        return "which ha" + (player.ew.points.eq(1)?"s":"ve") + " provided " + formatWhole(x) + " fading whisper(s)." 
    },
    decay() {
        let x = new Decimal(0.01) // you keep x*100% of your current player.ew.fw every tick and the rest disappears, do not reach beyond 1
        hasUpgrade('ew',11)?x=x.mul(upgradeEffect('ew',11)):x
        let decay = new Decimal(1).sub(x) // does the percentage shit
        return decay
    },
    update(diff) {
        let dif = new Decimal(diff)
        player.ew.fw.gte(0)?player.ew.fw = player.ew.fw.sub(player.ew.fw.mul(layers.ew.decay()).mul(dif)):player.ew.fw
        player.ew.fw.lte(0)?player.ew.fw = decimalZero:player.ew.fw
    },
    tabFormat: {
        "also main": {
            content:[
                ["infobox", "lore"],
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                ["display-text", function() {
                    return "You have " + format(player.ew.fw) + " fading whispers, which are being divided by " + formatWhole(Decimal.div(1, decimalOne.sub(layers.ew.decay()))) + " every second."
                }],
                ["display-text", function() {
                    return "Effect: " + format(tmp.ew.effect.p) + "x point gain" + (hasUpgrade('ew',24)?`, ` + format(tmp.ew.effect.sl) + `x SL gain.`:".")
                }],
                "blank",
                "upgrades",
            ]
        },
        "milestones": {
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "milestones"
            ]
        }
    },
    effect() {
        // minimum point value
        let minvalue = player.ew.points.pow(2).min(5000).pow(3).add(1).max(0)
        let minvalues = player.ew.points.pow(2).sub(5000).max(0).root(4).add(1)

        // also softcap
        if (player.ew.points.pow(2).gte(5000)) {
            minvalue = minvalue.mul(minvalues)
        }

        // point gain
        let p = player.ew.fw.min(5000).pow(4).add(1).mul(hasUpgrade('ew',23)?upgradeEffect('ew',23):1).max(hasUpgrade('ew',21)?minvalue:1)
        let psoftcap = player.ew.fw.sub(5000).max(0).root(4).add(1)
        hasUpgrade('sl',14)?psoftcap = psoftcap.mul(upgradeEffect('sl',14)):psoftcap

        // softcap'th
        if (player.ew.fw.gte(5000)) {
            p = p.mul(psoftcap)
        }

        // echoic whisper gain
        let ew = player.ew.fw.min(100).pow(0.8).add(1)
        let ewsoftcap = player.ew.fw.sub(100).pow(0.4).add(1)

        // shards of light gain
        let sl = player.ew.fw.min(200).pow(7).add(1)
        let slsoftcap = player.ew.fw.sub(200).root(19).add(1)

        // softcap'th II
        if (player.ew.fw.gte(100)) ew = ew.mul(ewsoftcap)
        if (player.ew.fw.gte(200)) sl = sl.mul(slsoftcap) 

        // the return i guess
        return {
            p:p,
            ew:ew,
            sl:sl,
        }
    },
    upgrades: {
        11: {
            title: "Chaotic Results",
            description: "Decay is lessened based on echoic whispers.",
            cost() {
                return player.ew.fw.pow(1.2).max(20).min(100)
            },
            currencyDisplayName: "fading whispers",
            currencyLayer: "ew",
            currencyInternalName: "fw",
            effect() {
                return player.ew.points.add(1).log(3).div(3).add(1)
            },
            effectDisplay() {
                return "/" + format(upgradeEffect('ew',11))
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            }
        },
        12: {
            title: "Shattered Harmony",
            description: "Fading Whispers boost Echoic Whispers",
            cost() {
                return player.ew.fw.pow(1.2).max(500).min(2000)
            },
            currencyDisplayName: "fading whispers",            
            currencyLayer: "ew",
            //currencyLocation: "player.ew",
            currencyInternalName: "fw",
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
            effectDisplay() {
                return format(tmp.ew.effect.ew) + "x"
            }
        },
        13: {
            title: "Points of Light",
            description: "Point gain are boosted by SL.",
            cost() { return new Decimal(5e4)},
            effect() {
                let x = player.sl.points.min(1e8).add(1).pow(0.88).add(1)
                let xSoftcap = player.sl.points.sub(1e8).add(1).root(20).add(1)
                if (player.sl.points.gte(1e8)) x = x.mul(xSoftcap)
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('ew',13))+"x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
        },
        14: {
            title: "Shards of Points",
            description: "SL gain is boosted by points.",
            cost() {
                return new Decimal(1e5)
            },
            effect() {
                let x = player.points.add(1).log(3).pow(4).add(1)
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('ew',14))+"x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
        },
        15: {
            title: "&quot;first&quot;",
            description() {
                return (player.ew.unlockOrder > 0?"This layer acts as if you chose EW first, also e":"E") + "choic whispers boost themselves."
            },
            cost: new Decimal("5e8"),
            effect() {
                let x = player.ew.points.add(1).log(5).pow(2.1).add(1)
                return x
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
            onPurchase() {
                player.ew.unlockOrder > 0?player.ew.unlockOrder--:player.ew.unlockOrder
            },
            effectDisplay(){
                return format(upgradeEffect('ew',15)) + "x"
            }
        },
        21: {
            title: "I Ran Out Of Ideas",
            description: "There's a reduced multiplier floor for the decaying point bonus",
            cost: new Decimal(1e11),
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
            effectDisplay() {
                let x = player.ew.points.pow(2).min(5000).pow(3).add(1)
                let xsoftcap = player.ew.points.pow(2).sub(5000).max(0).root(4).add(1).mul(hasUpgrade('ew',23)?upgradeEffect('ew',23):1)
                if (player.ew.points.pow(2).gte(5000)) x = x.mul(xsoftcap)
                return format(x) + "x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
        },
        22: {
            title: "Wait I Have An Idea",
            description: "EF milestone 2 is ^4.00",
            cost: new Decimal("2e11"),
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            }
        },
        23: {
            title: "Fading Screams",
            description: "Fading Whisper amount is boosted by points",
            cost: new Decimal("3e13"),
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
            effect() {
                let x = player.points.add(1).log10().pow(5.5).add(1)
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('ew',23)) + "x"
            },
            canAfford() {
                player.points.gte(layers.ew.requires())
            },
            onPurchase() {
                doReset('ew')
            },
        },
        24: {
            title: "Light Surge",
            description: "SL gain is also boosted by Fading Whispers.",
            cost: new Decimal("1e21"),
            effectDisplay() {
                return format(tmp.ew.effect.sl) + "x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('ew',11)
            },
        }
    },    
    milestones: {
        0: {
            requirementDescription: "10 echoic whispers",
            effectDescription: "Keep all EF milestones on this layer only.",
            done() {
                return player.ew.best.gte(10)
            }
        },
        1: {
            requirementDescription: "200 echoic whispers",
            effectDescription: "Keep all EF upgrades on this layer only.",
            done() {
                return player.ew.best.gte(200)
            }
        },
        2: {
            requirementDescription: "1.00e32 echoic whispers",
            effectDescription: "&quot;Retribution&quot; is no longer required to be kept on reset on Row 3.",
            done() {
                return player.ew.total.gte(1e32)
            }
        },
        3: {
            requirementDescription: "1e40 echoic whispers",
            effectDescription: "Auto-buy Light Cores.",
            done() {
                return player.ew.points.gte("1e40")
            },
            toggles: [
                ["ew", "auto"]
            ]
        },
    },
    doReset(resettingLayer) {
        // Create an array of fields to keep
        let keep = []; // Field names to preserve during reset
        !hasUpgrade('ew',15)?keep.push("unlockOrder"):keep
    
        if (layers[resettingLayer].row > this.row) { 
            // Reset the layer while keeping specified fields
            layerDataReset(this.layer, keep);
        }
    },
    canReset() {
        return (!hasMilestone('ew',2) ? hasUpgrade('ef',15) : true) && player.points.gte(layers.ew.requires());
    },
    infoboxes: {
        "lore": {
            title: "This is the This is the of All Time",
            body() {
                return `The remnants of Luminara’s golden age echo faintly in the void, carried by fleeting whispers that barely graze the edge of perception. These echoes are fragile and elusive, slipping away as time marches forward. They are not mere sounds but fragments of forgotten memories, moments of joy, love, and creation, now reduced to shadows of their former glory. The citizens who once thrived in harmony left behind these spectral murmurs, tethered to a fading hope that perhaps, in time, someone might listen.`
            },
            unlocked() {
                return player.ew.unlocked
            }
        }
    }
})

addLayer("hs", {
    name: "hyperspace", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HS", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        unlockOrder: 0,
        length: new Decimal(0),
        spentseeds: new Decimal(0),
    }},
    color: "#9966cc",
    requires() {
        return new Decimal(500).mul((player.hs.unlockOrder)?800000:1)
    }, // Can be a function that takes requirement increases into account
    resource: "harmonic seed(s)", // Name of prestige currency
    baseResource: "shard(s) of light", // Name of resource prestige is based on
    baseAmount() {return player.sl.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        getBuyableAmount('hs',11).gte(3)?mult=mult.div(buyableEffect('hs',11).hs):mult
        hasUpgrade('hs',14)?mult=mult.div(upgradeEffect('hs',14)):mult
        hasUpgrade('hs',21)&&player.hs.points.lt(player.hs.best)?mult=mult.div(upgradeEffect('hs',21)):mult //upgradeEffect('hs',21) equals 1.00E+100
        player.hs.points.gte(10)?mult=mult.mul(Decimal.pow(4.2, player.hs.points.sub(10).pow(2))):mult
        player.hs.points.gte(15)?mult=mult.mul(Decimal.pow(10, player.hs.points.sub(12).pow(1.8).ceil())):mult
        player.hs.points.gte(20)?mult=mult.mul(Decimal.pow(1.05, player.hs.points.pow(2).ceil())):mult
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 2,
    hotkeys: [
        {key: "h", description: "H: WHAT DO I PUT HERE I'M GOING CRAZY AAAAHHHHReset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        return hasUpgrade('ef',15)||player.hs.unlocked||player.ew.unlocked?true:false
    },
    nodeStyle() { return {
        //"background": "linear-gradient(to right, #dc143c, #7f8c8d)",
        "background":(player.hs.unlocked||canReset('hs'))?"radial-gradient(#66cc66, #9966cc)":"#bf8f8f"
        }
    },
    componentStyles: {
        "prestige-button"() {
            return {
                /* this is for reference for a future layer
                "background": "linear-gradient(to left, #ff0000, #00ff00)",
                "background-position": "calc(50% - 5px) center",
                "background-size": "120% 100%",*/
                "background":(canReset('hs'))?"radial-gradient(#66cc66, #9966cc)":"#bf8f8f"
            }
        }
    },   
    branches:['ef'],
    increaseUnlockOrder:['ew'],
    update(diff) {
        let dif = new Decimal(diff)
        let mult = player.hs.spentseeds.mul(2)
        let prod = new Decimal(1e-4).times(Decimal.pow(1.05, dif)).mul(mult);
        hasUpgrade('hs',11)?prod=prod.mul(upgradeEffect('hs',11)):dif
        hasUpgrade('hs',22)?prod=prod.mul(upgradeEffect('hs',22)):dif
        hasUpgrade('e',12)?prod=prod.mul(upgradeEffect('e',12)):dif
        hasUpgrade('e',24)?prod=prod.mul(upgradeEffect('e',24)):dif
        //hasUpgrade('hs',24)&&player.hs.length.lte(50)?prod.pow(2):prod
        player.hs.unlocked?player.hs.length=player.hs.length.add(prod):diff
    },
    tabFormat: {
        "main": {
            content:[
                ["infobox", "lorethpt3"],
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "resource-display",
                ["infobox", "yeah."],
                "blank",
                ["display-text", function() {return "It's been " + (player.hs.unlocked?formatTime(player.hs.resetTime):"so long") + " since you reset."}],
                "blank",
                ["display-text", function() {
                    return "Tree Length: " + format(player.hs.length) + "m<br>Effect: " + format(layers.hs.effect()) + "x point gain" + (getBuyableAmount('hs',11).gte(1)?`, ` + format(buyableEffect('hs',11).sl) + `x SL gain` + (getBuyableAmount('hs',11).gte(2)?", " + format(buyableEffect('hs',11).ef) + "x EF gain" + (getBuyableAmount('hs',11).gte(3)?", /" + format(buyableEffect('hs',11).hs) + " HS requirement (not hyperspace sorry i needed to make that joke at some point).":"."):"."):".")
                }],
                "blank",
                ["infobox", "yeah. (2)"],
                ["row",[["clickable",11], ["buyable", "11"]]],
                "upgrades",
            ]
        },
        "milestones": {
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "milestones"
            ]
        }
    },
    clickables: {
        11: {
            title: "Plant seeds",
            display() {
                return "Using the magical powers of coding, plant a seed and watch a tree grow! The tree does not like resets and it dies if you do! (It starts growing again after the reset anyway) (Also for plothole reasons, seeds after the first one are actually just boosters for growth speed)<br>Seeds planted: " + formatWhole(player.hs.spentseeds)
            },
            canClick() {
                return player.hs.spentseeds.lt(player.hs.points)
            },
            onClick() {
                player.hs.spentseeds = player.hs.points
            },
            style: {
                "width": "200px",
                "height": "200px"
            }
        }
    },
    effect() {
        let x = player.hs.length.min(9.6).mul(2).add(1).pow(7)
        let y = player.hs.length.sub(9.6).mul(2).add(1).pow(0.25)
        player.hs.length.gte(9.6)?x=x.mul(y):x
        hasUpgrade('hs',24)?x=x.pow(3):x
        return x
    },
    canReset() {
        return (!hasMilestone('ew',2)?hasUpgrade('ef',15):true) && player.sl.points.gte(getNextAt('hs'))
    },
    onPrestige() {
        player.hs.length = new Decimal(0)
    },
    upgrades: {
        11: {
            title: "Harmonic Yield",
            description: "Tree growth is boosted by your SL.",
            cost: new Decimal(2),
            effect() {
                let x = player.sl.points.add(1).log(2).add(1).log(2).div(3).add(1)
                return x
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
            effectDisplay() {
                return format(upgradeEffect('hs',11)) + "x"
            }
        },
        12: {
            title: "Branches",
            description: "The tree also grows branches which boost other aspects.",
            cost: new Decimal(3),
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        13: {
            title: "Recursive Points",
            description: "Points boost their own production. (about time i guess)",
            cost: new Decimal(4),
            effect() {
                let x = player.points.add(1).log(10).pow(5.5).add(1)
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('hs',13)) + "x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        14: {
            title: "Recursive Seeds",
            description: "Harmonic seeds decrease their own requirement.",
            cost: new Decimal(5),
            effect() {
                let x = player.hs.points.add(1).log(3).root(4).add(1)
                return x
            },
            effectDisplay() {
                return "/" + format(upgradeEffect('hs',14))
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        15: {
            title: "Recursive Light",
            description: "SL boost their own production.",
            cost: new Decimal(4),
            effect() {
                let x = player.sl.points.min(10000).add(1).pow(3.3).add(1)
                let y = player.sl.points.sub(10000).add(1).log10().pow(3).add(1)
                player.sl.points.gte(10000)?x=x.mul(y):x
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('hs',15)) + "x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        21: {
            title: `"first"`,
            description() {
                return (player.hs.unlockOrder > 0?"This layer acts as if you chose HS first, also h":"H") + "aving less seeds than best makes them cost as much as the first."
            },
            cost: new Decimal(6),
            effect() {
                return new Decimal("1e100")
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
            onPurchase() {
                player.hs.unlockOrder > 0?player.hs.unlockOrder--:player.hs.unlockOrder
            }
        },
        22: {
            title: "Impatience",
            description: "is a virtue and I upgradified it.",
            cost: new Decimal(7),
            effect() {
                let x = player.hs.length.min(4).pow(1.25).add(1)
                let y = player.hs.length.add(1).log(10).pow(5).add(1)
                player.hs.length.gte(2)?x=x.mul(y):x
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('hs',22)) + "x tree growth speed."
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        23: {
            title: "A Giant Seed",
            description: "Harmonic seeds heavily boost point gain.",
            cost: new Decimal(8),
            canAfford() {return hasUpgrade('hs',22)},
            effect() {
                let w = player.points.add(1).log(500).add(1).log(500).pow(2).add(1)
                let x = Decimal.pow(99, player.hs.points).pow(w)
                return x
            },
            effectDisplay() {
                return format(upgradeEffect('hs',23)) + "x"
            },
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        24: {
            title: "One Last Push",
            description: "Tree point formula is cubed.",
            cost: new Decimal(11),
            unlocked() {
                return getBuyableAmount('sl',11).gte(5)||hasUpgrade('hs',11)
            },
        },
        25: {
            title: "Restoration",
            description: `"Redistribution" nerf (base /10) is <s>nerfed</s> reduced based on Row 3 currencies.`,
            cost: new Decimal(15),
            effect() {
                let hs = player.hs.points.pow(0.5)
                let ew = player.ew.points.log10().pow(0.5)
                let x = hs.add(ew).div(5).add(1)
                return x
            },
            unlocked() {
                return hasUpgrade('ew',24)
            },
            effectDisplay() {
                return "/" + format(upgradeEffect('hs',25))
            },
        },
    },
    buyables: {
        11: {
            title: "Branches",
            display() {return"Allows the tree to boost more than points.<br>Cost: " + formatWhole(tmp.hs.buyables[11].cost) + " harmonic seeds.<br>So far, the tree has boosted:" + (getBuyableAmount('hs',11).gte(1)?"<br>SL Gain (" + format(buyableEffect('hs',11).sl) + "x)":"<br>absolutely nothing.") + (getBuyableAmount('hs',11).gte(2)?"<br>EF Gain (" + format(buyableEffect('hs',11).ef) + "x)":"") + (getBuyableAmount('hs',11).gte(3)?"<br>HS requirement (/" + format(buyableEffect('hs',11).hs) + ")":"")},
            cost() {
                return getBuyableAmount('hs',11).eq(0)?decimalZero:getBuyableAmount('hs',11).pow(1.2).add(2).floor()
            },
            canAfford() {
                return player.hs.points.gte(tmp.hs.buyables[11].cost)
            },
            buy() {
                player.hs.points = player.hs.points.sub(tmp.hs.buyables[11].cost).ceil()
                setBuyableAmount('hs', 11, getBuyableAmount('hs',11).add(1))
            },
            unlocked() {
                return hasUpgrade('hs',12)?true:false
            },
            effect() {
                let x = player.hs.length.min(100000).pow(3).mul(1.5).add(1)
                let y = player.hs.length.min(100000).pow(2.5).mul(2.5).add(1)
                let z = player.hs.length.min(9.33).pow(2).div(10.5).add(1)
                let softcap = player.hs.length.pow(1.2).div(10).add(1)
                let zsoftcap = player.hs.length.pow(0.23).div(21).add(1)
                if (player.hs.length.gte(10)){
                    z=z.mul(zsoftcap)
                }
                if (player.hs.length.gte(100000)){
                    x=x.mul(softcap)
                    y=y.mul(softcap)
                }
                return {
                    sl:x,
                    ef:y,
                    hs:z,
                }
            },
            purchaseLimit() {return new Decimal(3)}
        }
    },
    milestones: {
        0: {
            requirementDescription: "2 harmonic seeds",
            effectDescription: "Keep all EF milestones on this layer only.",
            done() {
                return player.hs.best.gte(2)
            }
        },
        1: {
            requirementDescription: "3 harmonic seeds",
            effectDescription: "Keep all EF upgrades on this layer only.",
            done() {
                return player.hs.best.gte(3)
            }
        },
        2: {
            requirementDescription: "11 total harmonic seeds",
            effectDescription: "Passively generate EF points.",
            done() {
                return player.hs.total.gte(11)
            }
        },
        3: {
            requirementDescription: "120 harmonic seeds",
            effectDescription: "I have hardcapped how much you can have of each point. In order to continue, you have to buy the full version for $4.99 k bye",
            done() {
                return player.hs.points.gte(120)
            },
            unlocked() {
                return player.hs.points.gte(120)
            },
        },
    },
    infoboxes: {
        "yeah.":{
            title: "You Look Like You're Lost",
            body() {
                return `You need the 5th EF upgrade "Redistribution". (im sorry :c)`
            },
            unlocked() {return player.sl.points.gte(getNextAt('hs'))&&!hasUpgrade('ef',15)&&!hasMilestone('ew',2)}
        },
        "yeah. (2)":{
            title: "You Look Like You're Lost pt. 2",
            body() {
                return "You probably should check Light Cores more often."
            },
            unlocked() {return player.hs.points.gte(5)&&getBuyableAmount('sl',11).lt(5)}
        },
        "lorethpt3":{
            title: "This Is, In Fact, Also The Lore Of All Time",
            body: `Despite the desolation of the void, faint sparks of life remain, seeds buried deep within the echoes of what once was. These, however, are not the same as the abundant growth of Luminara’s past, but they hold a faint promise. Their roots stretch into the void, drawing nourishment from the balance between decay and memory. Each seed is a testament to resilience, a fragment of Luminara’s will to flourish again, even in the harshest of conditions.`,
            unlocked() {return player.hs.unlocked}
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (!hasUpgrade('hs',21)) keep.push("unlockOrder")
        
            if (layers[resettingLayer].row > this.row) { 
                layerDataReset(this.layer, keep)
            }  
        if (resettingLayer == "e" && hasUpgrade('e',12)) player.hs.length = new Decimal(0)
    }
})

addLayer("e", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal("1e155"), // Can be a function that takes requirement increases into account
    resource: "equilibrium essence", // Name of prestige currency
    baseResource: "shards of light", // Name of resource prestige is based on
    baseAmount() {return player.sl.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        hasUpgrade('e',13)?mult=mult.mul(upgradeEffect('e',13)):mult
        hasUpgrade('e',14)?mult=mult.mul(upgradeEffect('e',14)):mult
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.33)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 1,
    hotkeys: [
        {key: "E", description: "Shift+E: mango phonk + balkan rage + lunchly + thick of it + still water + aerated prime + english or spanish + german stare + adrenaline + noradrenaline + winter arc + hawk tuah + skibidi sigma + those who know 💀💀💀", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('hs',25)},
    nodeStyle() { return {
        //"background": "linear-gradient(to right, #dc143c, #7f8c8d)",
        "background": (player.e.unlocked || canReset('e')) 
            ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" 
            : "#bf8f8f",
        "background-position": "calc(50% - 1px) center",
        "background-size": "115% 100%",
        }
    },
    componentStyles: {
        "prestige-button"() {
            return {
                /* this is for reference for a future layer
                "background": "linear-gradient(to left, #ff0000, #00ff00)",
                "background-position": "calc(50% - 5px) center",
                "background-size": "120% 100%",*/
                "background": (canReset('e')) 
                ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" 
                : "#bf8f8f",
                "background-position": "calc(50% - 1px) center",
                "background-size": "115% 100%",
            }
        },
    },   
    branches: ['ef'],
    upgrades: {
        11: {
            title: "Equilibrium Flow",
            description: "SL is boosted by your Equilibrium Essence.",
            cost: new Decimal(1),
            effect() {
                let x = player.e.points.add(1).log(50).pow(5).add(1)
                let xs = x.root(8).min(120)
                x = x.min("1e5")
                x.gte("1e5")?x=x.mul(xs):x
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',11))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',12)
            }
        },
        12: {
            title: "Ephemeral Roots",
            description: "Spent seeds boost tree length, but the tree resets on this Equilibrium reset.",
            cost: new Decimal(1),
            effect() {
                let x = player.hs.spentseeds.add(1).log(6).pow(2.5).add(1)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',11)
            }
        },        
        13: {
            title: "Essence Surge",
            description: "Echoic Whispers boost Equilibrium Essence gain.",
            cost: new Decimal(50),
            effect() {
                let x = player.ew.points.add(1).log10().pow(0.75).add(1).min(20)
                let xs = x.sub(20).add(1).log10().root(2).add(1)
                x.gte(20)?x=x.mul(xs):x
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',14)
            }
        },
        14: {
            title: "Essence Flow",
            description: "Shards of Light boosts Equilibrium Essence gain.",
            cost: new Decimal(50),
            effect() {
                let x = player.sl.points.add(1).log(18).root(2).add(1)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',13)
            }
        },
        15: {
            title: "Resonance III",
            description: "EF milestone 2 formula is reworked.<br>(Also keep this upgrade on reset)",
            cost: new Decimal("5e5"),
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
        },
        21: {
            title: "Recursive Points II",
            description: "Points boost themselves (again)",
            cost: new Decimal("1e32"),
            effect() {
                let w = player.points.add(1).log(100).pow(2).add(1)
                let x = player.points.add(1).log(2).pow(w).add(1).min("1e100")
                let xs = player.points.add(1).log(5).pow(1.2).add(1)
                if (x.gte("1e100")) x = x.mul(xs)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',22)
            }
        },
        22: {
            title: "Recursive Echo",
            description: "Echo Fragments boost themselves",
            cost: new Decimal("1e32"),
            effect() {
                let w = player.ef.points.add(1).log(100).pow(0.65).add(1)
                let x = player.ef.points.add(1).log(4).pow(w).add(1).min("1e1000")
                let xs = player.ef.points.add(1).log(2).pow(0.9).add(1)
                if (x.gte("1e1000")) x = x.mul(xs)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',21)
            }
        },
        23: {
            title: "Temporal Growth",
            description: "Equilibrium reset time boosts Echoic Whispers.",
            cost: new Decimal("1e48"),
            effect() {
                let w = new Decimal(player.e.resetTime)
                let x = w.pow(3)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',24)
            }
        },
        24: {
            title: "Recursive Growth",
            description: "Time spent on Equilibrium reset boosts tree growth.",
            cost: new Decimal("1e48"),
            effect() {
                let w = new Decimal(player.e.resetTime)
                let x = w.add(1).log10().pow(4).add(1)
                return x
            },
            effectDisplay() {
                return `${format(upgradeEffect('e',this.id))}x`
            },
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
            canAfford() {
                return !hasUpgrade('e',23)
            }
        },
        25: {
            title: "Upgrades of Light",
            description: "Unlock 3 Shards of Light upgrades.<br>(Also keep this upgrade on reset)",
            cost: new Decimal("1ee1000"),
            style(){
                return {
                    "background": 
                    canAffordUpgrade(this.layer, this.id) && !hasUpgrade(this.layer, this.id) ? "linear-gradient(to right, #d64a4a 15%, #4ecacb 40%, #66cc66 60%, #9966cc)" : 
                    (!hasUpgrade(this.layer, this.id) ? "#bf8f8f" : "#77bf5f"),
                    "background-position": "calc(50% - 1px) center",
                    "background-size": "115% 100%",
                }
            },
        }
    },
    doReset(resettingLayer) {
        let keep = [];

        if (layers[resettingLayer].row > this.row) { 
            // Reset the layer while keeping specified fields
            layerDataReset(this.layer, keep);
            
        }
        let kept = [];
        hasUpgrade('e',15)?kept = kept.concat(15):kept
        resettingLayer === "e"?player.e.upgrades = kept:player.e.upgrades;
    },
    milestones: {
        0: {
            requirementDescription: "1,000 equilibrium essence",
            effectDescription: "Keep EF upgrades and milestones on reset.",
            done() {
                return player.e.best.gte(1000)
            }
        }
    },
})