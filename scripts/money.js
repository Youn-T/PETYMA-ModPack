import { ScoreboardIdentityType, system, world, Player, Entity, EntityInventoryComponent, Container } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, ModalFormData } from "@minecraft/server-ui";

world.beforeEvents.chatSend.subscribe(data => {
    let player = data.sender;
    if (data.message.startsWith("?portefeuille")) {
        data.cancel = true;
        let args = data.message.split(" ");
        if (args.length == 2) {
            let targetId = getIdentity(args[1]);
            if (targetId) {
                let pytCoin = getMoney(targetId);
                if (targetId.type == ScoreboardIdentityType.Player) {
                    player.sendMessage(`§g§lPortefeuille du joueur ${targetId.displayName}:§r§f\nPYTcoin: ${pytCoin}`)
                } else {
                    player.sendMessage(`§g§lPortefeuille de l'entité légale ${targetId.displayName}:§r§f\nPYTcoin: ${pytCoin}`)
                }
            } else {
                player.sendMessage("§4veuillez spécifier un joueur ou une entité existante");
            }
        } else {
            let targetId = getIdentity(player.name);
            let pytCoin = getMoney(targetId);
            player.sendMessage(`§g§lVotre portefeuille:§r§f\nPYTcoin: ${pytCoin}`)
        }
    } else if (data.message.startsWith("?admin-money")) {
        data.cancel = true;
        let args = data.message.split(" ");
        system.run(() => adminMoney(args, player))
    } else if (data.message.startsWith("?virement")) {
        data.cancel = true;
        let args = data.message.split(" ");
        system.run(() => virement(args, player));
    }
})

function virement(args, player) {
    if (args.length != 3) {
        player.sendMessage("§4commande malformée");
        return;
    }
    let targetId = getIdentity(args[1]);
    var amount;
    try {
        amount = parseInt(args[2]);
    } catch (e) {
        player.sendMessage("§4Veuillez spécifier un nombre valide")
        return;
    }
    let playerMoney = getMoney(getIdentity(player.name));
    if (amount <= playerMoney) {
        if (targetId) {
            removeMoney(getIdentity(player.name), amount);
            addMoney(targetId, amount);
            player.sendMessage(`§f§lVirement effectué vers le compte de ${targetId.displayName}\n§r§fVous avez maintenant ${playerMoney - amount} PYTCoins`);
            if (targetId.type == ScoreboardIdentityType.Player) {
                let targetMoney = getMoney(targetId)
                targetId.getEntity().sendMessage(`§f§lVous avez reçu un virement de ${amount} PYTcoin(s) de la part de ${player.name}\n§r§fVous avez maintenant ${targetMoney} PYTCoins`)
            }
        } else {
            player.sendMessage(`§4veuillez spécifier un joueur ou une entité existante : ${args[1]} n'existe pas`)
        }
    } else {
        player.sendMessage("§4Vous n'avez pas assez pour faire ce virement")
    }
}

function adminMoney(args, player) {
    if (args.length != 4) return;
    let targetId = getIdentity(args[2]);
    let amount = parseInt(args[3]);
    if (targetId) {
        if (args[1] == "add") {
            if (amount > 0) {
                addMoney(targetId, amount);
                player.sendMessage("§f§gMontant Actualisé")
            } else {
                player.sendMessage("§4veuillez spécifier un montant superieur à 0")
            }
        } else if (args[1] == "remove") {
            if (amount > 0) {
                removeMoney(targetId, amount);
                player.sendMessage("§f§gMontant Actualisé")
            } else {
                player.sendMessage("§4veuillez spécifier un montant superieur à 0")
            }
        } else if (args[1] == "set") {
            setMoney(targetId, amount);
            player.sendMessage("§f§gMontant Actualisé")
        }
    } else {
        player.sendMessage(`§4veuillez spécifier un joueur ou une entité existante : ${args[2]} n'existe pas`);
    }
}

function addMoney(target, amount) {
    world.scoreboard.getObjective("money").addScore(target, amount)
}

function removeMoney(target, amount) {
    world.scoreboard.getObjective("money").addScore(target, -amount)
}

function setMoney(target, amount) {
    world.scoreboard.getObjective("money").setScore(target, amount)
}

function getIdentity(targetName) {
    for (let id of world.scoreboard.getObjective("money").getParticipants()) {
        if (id.displayName == targetName) {
            return id;
        }
    }
}

function getMoney(target) {
    return world.scoreboard.getObjective("money").getScore(target)
}

async function addInitialMoney(player) {
    world.scoreboard.getObjective("money").addScore(player, 10);
}

world.afterEvents.worldLoad.subscribe(data => {
    if (world.scoreboard.getObjective("money") == null) {
        world.scoreboard.addObjective("money");
    }
})

world.afterEvents.playerSpawn.subscribe(data => {
    let player = data.player;
    if (!(world.scoreboard.getObjective("money").hasParticipant(player))) {
        world.scoreboard.getObjective("money").addScore(player, 10);
        player.sendMessage("10 PYTcoins ont été rajoutés à votre portefeuille pour commencer !")
    }
})


world.beforeEvents.playerPlaceBlock.subscribe(data => {
    let player = data.player;
    if (data.permutationBeingPlaced.type.id == "petyma:tpe") {
        data.cancel = true;
        let player = data.player;
        system.run(() => spawnTPE(player, data));
    }
})

/**
 *
 * @param {Player} player
 */
function spawnTPE(player, data) {
    /**
     * @type {Entity}
     */
    let entity = data.dimension.spawnEntity("petyma:tpe", { x: data.block.center().x, y: data.block.location.y + 1 - 1, z: data.block.center().z }) // , { initialRotation: getRotationViaDirection(player.getViewDirection()) }
    entity.setRotation({ x: player.getRotation().x, y: computeRotation(player.getRotation().y) });
    entity.addTag(`tpe-${player.name}`);
}

function computeRotation(rot) {
    if (0 < rot && rot < 45) {
        return 180
    } else if (45 < rot && rot < 135) {
        return -90
    } else if (rot < -135 || rot > 135) {
        return 0
    } else if (-135 < rot && rot < 0) {
        return 90
    }
}

world.afterEvents.playerInteractWithEntity.subscribe(data => {
    if (data.target.hasTag(`tpe-${data.player.name}`)) {
        let form = new ActionFormData()
            .title("Options tpe")
            .button("définir la somme à payer")
            .button("supprimer le tpe")

        form.show(data.player).then((result) => {
            if (result.selection == 1) {
                data.target.remove();
            } else if (result.selection == 0) {
                let moneyForm = new ModalFormData()
                    .title("définir la somme à payer")
                    .slider("Montant", 1, 1000, 1)
                moneyForm.show(data.player).then((res) => {
                    let slider = res.formValues[0];
                    removeMoneyTag(data.target);
                    data.target.addTag(`money-${slider}`);
                    data.target.nameTag = `${slider} PytCoins à payer`;
                    system.runTimeout(() => removeMoneyCount(data.target), 300);
                })

            }
        })
    } else {
        if (data.beforeItemStack && data.target.typeId == "petyma:tpe") {
            if (data.beforeItemStack.typeId == "petyma:cb") {
                if (getTpeMoney(data.target) == null) {
                    data.player.sendMessage("§4Le propriétaire du tpe n'a pas défni de somme à payer");
                    return;
                }
                if (!isPaying(data.target, data.player.name)) {
                    data.player.sendMessage(`vous devez payer ${getTpeMoney(data.target).split("-")[1]} pytcoins, veuillez confirmer le paiement`);
                    data.target.addTag(`paying-${data.player.name}`);
                    system.runTimeout(() => payingTag(data.player.name, data.target), 100);
                } else {

                    virement(["virement", getTpeOwner(data.target), getTpeMoney(data.target).split("-")[1]], data.player)
                    data.target.removeTag(`paying-${data.player.name}`)
                    data.target.removeTag(getTpeMoney(data.target))
                }
            } else if (data.beforeItemStack.typeId == "petyma:pytcoin") {
                if (getTpeMoney(data.target) == null) {
                    data.player.sendMessage("§4Le propriétaire du tpe n'a pas défni de somme à payer");
                    return;
                }
                let payer = getIdentity(data.player.name)
                let paye = getIdentity(getTpeOwner(data.target))
                if (countItems(data.player, "petyma:pytcoin") < parseInt(getTpeMoney(data.target).split("-")[1])) {
                    data.player.sendMessage("§4Vous n'avez pas assez pour payer ainsi");
                    return;
                }
                addMoney(getTpeOwner(data.target), parseInt(getTpeMoney(data.target).split("-")[1]))
                data.player.runCommand(`clear @s petyma:pytcoin 0 ${getTpeMoney(data.target).split("-")[1]}`)
                data.target.removeTag(getTpeMoney(data.target))
                data.target.nameTag = ""
            }
        } else if (data.target.typeId == "petyma:atm") {
            let form = new ActionFormData()
                .title("Options ATM")
                .button("retirer de l'argent")
                .button("déposer de l'argent")

            form.show(data.player).then((result) => {
                if (result.canceled) return;
                if (result.selection == 0) {
                    let moneyForm = new ModalFormData()
                        .title("définir la somme à retirer")
                        .slider("Montant", 1, 256, 1)
                    moneyForm.show(data.player).then((res) => {
                        let slider = res.formValues[0];
                        if (getMoney(getIdentity(data.player.name)) < slider) {
                            data.player.sendMessage("§4Vous n'avez pas assez pour retirer cette somme");
                            return
                        }
                        removeMoney(getIdentity(data.player.name), slider)
                        data.player.runCommand(`give @s petyma:pytcoin ${slider}`)
                    })
                } else if (result.selection == 1) {
                    let moneyForm = new ModalFormData()
                        .title("définir la somme à retirer")
                        .slider("Montant", 1, 256, 1)
                    moneyForm.show(data.player).then((res) => {
                        let slider = res.formValues[0];
                        if (countItems(data.player, "petyma:pytcoin") < slider) {
                            data.player.sendMessage("§4Vous n'avez pas assez pour déposer cette somme");
                            return;
                        }
                        addMoney(data.player, slider)
                        data.player.runCommand(`clear @s petyma:pytcoin 0 ${slider}`)
                    })
                }
            })
        }
    }
})

/**
 * 
 * @param {string} playerName 
 * @param {Entity} entity 
 */
function payingTag(playerName, entity) {
    entity.removeTag(`paying-${playerName}`)
}

function isPaying(entity, playerName) {
    for (let tag of entity.getTags()) {
        if (tag == `paying-${playerName}`) {
            return true;
        }
    }
}

function isPayingMoney(entity, playerName) {
    for (let tag of entity.getTags()) {
        if (tag == `paying-money-${playerName}`) {
            return true;
        }
    }
}

function removeMoneyCount(entity) {
    entity.nameTag = ""
    if (getTpeMoney(entity) != null) {
        entity.removeTag(getTpeMoney(entity));
    }
}

function getTpeMoney(entity) {
    for (let tag of entity.getTags()) {
        if (tag.startsWith("money-")) {
            return tag;
        }
    }
}

function getTpeOwner(entity) {
    for (let tag of entity.getTags()) {
        if (tag.startsWith("tpe-")) {
            return tag.split("-")[1];
        }
    }
}

/**
 * 
 * @param {Entity} entity 
 */
function removeMoneyTag(entity) {
    for (let tag of entity.getTags()) {
        if (tag.startsWith("money-")) {
            entity.removeTag(tag);
        }
    }
}

function countItems(player, _item) {
    /**
     * @type {Container}
     */
    let inventory = player.getComponent("minecraft:inventory").container;
    let count = 0;
    for (let i = 0; i < inventory.size; i++) {
        let item = inventory.getSlot(i).getItem();
        if (item != null ) {
            if (item.typeId == _item) {
                count += item.amount;
            }
        }
    }

    return count
}
// /**
//  *
//  * @param {import("@minecraft/server").Vector3} vec
//  */
// function getRotationViaDirection(vec) {
//     return { x: Math.round(vec.x), y: Math.round(vec.z) };
// }
// // world.afterEvents.inter