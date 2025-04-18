import { world, EffectTypes, EntityTameableComponent, system, EntityEquippableComponent, EquipmentSlot, EntityHealthComponent, Player, EntityInventoryComponent, EffectType } from "@minecraft/server";
import "./money"

const swordActive = false;

const EggPlaced = {
    onPlace(event) {
        switch (event.block.typeId) {
            case "ck:fire_wyvern_egg":
                event.dimension.runCommand(`summon ck:egg ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} facing ck:fire`);
                break;

            case "ck:ice_wyvern_egg":
                event.dimension.runCommand(`summon ck:egg ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} facing ck:ice`);
                break;

            case "ck:poison_wyvern_egg":
                event.dimension.runCommand(`summon ck:egg ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} facing ck:poison`);
                break;

            case "ck:abyssal_wyvern_egg":
                event.dimension.runCommand(`summon ck:egg ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} facing ck:abyssal`);
                break;

            case "ck:lightning_wyvern_egg":
                event.dimension.runCommand(`summon ck:egg ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} facing ck:lightning`);
                break;

        }
    }//,
    // onTick(event) {
    //     console.log(event.block.typeId);
    //     switch (event.block.typeId) {
    //         case "ck:abyssal_rune_block":
    //             event.dimension.runCommand(`summon ck:abyssal_wyvern ${event.block.center().x} ${event.block.center().y} ${event.block.center().z}`);
    //             event.dimension.runCommand(`setblock ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} ck:nest`);
    //             break;
    //         case "ck:poison_rune_block":
    //             event.dimension.runCommand(`summon ck:poison_wyvern ${event.block.center().x} ${event.block.center().y} ${event.block.center().z}`);
    //             event.dimension.runCommand(`setblock ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} ck:nest`);
    //             break;
    //         case "ck:fire_rune_block":
    //             event.dimension.runCommand(`summon ck:fire_wyvern ${event.block.center().x} ${event.block.center().y} ${event.block.center().z}`);
    //             event.dimension.runCommand(`setblock ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} ck:nest`);
    //             break;
    //         case "ck:lightning_rune_block":
    //             event.dimension.runCommand(`summon ck:lightning_wyvern ${event.block.center().x} ${event.block.center().y} ${event.block.center().z}`);
    //             event.dimension.runCommand(`setblock ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} ck:nest`);
    //             break;
    //         case "ck:ice_rune_block":
    //             event.dimension.runCommand(`summon ck:ice_wyvern ${event.block.center().x} ${event.block.center().y} ${event.block.center().z}`);
    //             event.dimension.runCommand(`setblock ${event.block.center().x} ${event.block.center().y} ${event.block.center().z} ck:nest`);
    //             break;
    //     }
    // }
};

world.afterEvents.worldLoad.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "ck:egg_placed",
        EggPlaced
    );
});

function getCurrentArmorState(player) {
    /**@type {EntityEquippableComponent} */
    const equipmentInventory = player.getComponent(EntityEquippableComponent.componentId);
    if (!equipmentInventory) return {};

    let armorState = {};
    for (let slot of [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet]) {
        const item = equipmentInventory.getEquipment(slot);
        armorState[slot] = item ? item.typeId : null;
    }
    return armorState;
}

var fireArmorT1 = {
    "Head": "ck:fire_dracolyte_helmet_infused",
    "Chest": "ck:fire_dracolyte_chestplate_infused",
    "Legs": "ck:fire_dracolyte_leggings_infused",
    "Feet": "ck:fire_dracolyte_boots_infused"
}

var iceArmorT1 = {
    "Head": "ck:ice_dracolyte_helmet_infused",
    "Chest": "ck:ice_dracolyte_chestplate_infused",
    "Legs": "ck:ice_dracolyte_leggings_infused",
    "Feet": "ck:ice_dracolyte_boots_infused"
}

var poisonArmorT1 = {
    "Head": "ck:poison_dracolyte_helmet_infused",
    "Chest": "ck:poison_dracolyte_chestplate_infused",
    "Legs": "ck:poison_dracolyte_leggings_infused",
    "Feet": "ck:poison_dracolyte_boots_infused"
}

var lightningArmorT1 = {
    "Head": "ck:lightning_dracolyte_helmet_infused",
    "Chest": "ck:lightning_dracolyte_chestplate_infused",
    "Legs": "ck:lightning_dracolyte_leggings_infused",
    "Feet": "ck:lightning_dracolyte_boots_infused"
}

var abyssalArmorT1 = {
    "Head": "ck:abyssal_dracolyte_helmet_infused",
    "Chest": "ck:abyssal_dracolyte_chestplate_infused",
    "Legs": "ck:abyssal_dracolyte_leggings_infused",
    "Feet": "ck:abyssal_dracolyte_boots_infused"
}

var poisonArmorT2 = {
    "Head": "ck:poison_metal_helmet_infused",
    "Chest": "ck:poison_metal_chestplate_infused",
    "Legs": "ck:poison_metal_leggings_infused",
    "Feet": "ck:poison_metal_boots_infused"
}

var iceArmorT2 = {
    "Head": "ck:ice_metal_helmet_infused",
    "Chest": "ck:ice_metal_chestplate_infused",
    "Legs": "ck:ice_metal_leggings_infused",
    "Feet": "ck:ice_metal_boots_infused"
}

var abyssalArmorT2 = {
    "Head": "ck:abyssal_metal_helmet_infused",
    "Chest": "ck:abyssal_metal_chestplate_infused",
    "Legs": "ck:abyssal_metal_leggings_infused",
    "Feet": "ck:abyssal_metal_boots_infused"
}

var lightningArmorT2 = {
    "Head": "ck:lightning_metal_helmet_infused",
    "Chest": "ck:lightning_metal_chestplate_infused",
    "Legs": "ck:lightning_metal_leggings_infused",
    "Feet": "ck:lightning_metal_boots_infused"
}

var fireArmorT2 = {
    "Head": "ck:fire_metal_helmet_infused",
    "Chest": "ck:fire_metal_chestplate_infused",
    "Legs": "ck:fire_metal_leggings_infused",
    "Feet": "ck:fire_metal_boots_infused"
}

/**
 * 
 * @param {Player} player
 * @returns {bool} 
 */

function checkArmorSet(player) {
    let armorState = getCurrentArmorState(player);

    if (JSON.stringify(armorState) == JSON.stringify(fireArmorT1) || JSON.stringify(armorState) == JSON.stringify(fireArmorT2)) {
        player.runCommand("/effect @s fire_resistance 20 1 true");
    } else {
        // player.runCommand("/effect @s clear fire_resistance");
    }

    if (JSON.stringify(armorState) == JSON.stringify(abyssalArmorT1) || JSON.stringify(armorState) == JSON.stringify(abyssalArmorT2)) {
        player.runCommand("/effect @s night_vision 20 1 true");
    } else {
        // player.runCommand("/effect @s clear night_vision");
    }

    if (JSON.stringify(armorState) == JSON.stringify(iceArmorT2) && player.isInWater) {
        player.runCommand("/effect @s conduit_power 20 1 true");
    } else if (JSON.stringify(armorState) == JSON.stringify(iceArmorT2) && !player.isInWater) {
        // player.runCommand("/effect @s clear conduit_power")
    }

    /** @type {EntityHealthComponent} */
    const healthComponent = player.getComponent(EntityHealthComponent.componentId);
    if (JSON.stringify(armorState) == JSON.stringify(lightningArmorT2) && healthComponent.currentValue < 8) {
        player.runCommand("/effect @s resistance 10 2");
    }
    else if (JSON.stringify(armorState) == JSON.stringify(lightningArmorT2) && healthComponent.currentValue > 8) {
        player.runCommand("/effect @s clear resistance");
    }

    if (JSON.stringify(armorState) == JSON.stringify(fireArmorT2)) {
        player.run
        let level_float = -((1.25) / (4)) * healthComponent.currentValue + 4;
        let level_int = Math.floor(level_float);
        if (level_int > -1) {
            player.runCommand(`/effect @s strength 1 ${level_int}`);
        }
    }
    else if (JSON.stringify(armorState) == JSON.stringify(fireArmorT2) && healthComponent.currentValue > 8) {
        player.runCommand("/effect @s clear strength");
    }

    // if (JSON.stringify(armorState) == JSON.stringify(lightningArmorT2) && player.)

    // if (JSON.stringify(armorState) == JSON.stringify(poisonArmorT1)) {
    //     player.runCommand("/effect @s fire_resistance 10 1 true");
    // }

    // if (JSON.stringify(armorState) == JSON.stringify(iceArmorT1)) {
    //     player.runCommand("/effect @s fire_resistance 10 1 true");
    // }

    // if (JSON.stringify(armorState) == JSON.stringify(lightningArmorT1)) {
    //     player.runCommand("/effect @s night 10 1 true");
    // }
}

function armorEffects() {
    for (let player of world.getPlayers()) {
        checkArmorSet(player);
    }


    system.runTimeout(armorEffects, 20);
}

world.afterEvents.entityHurt.subscribe(data => {
    let player = data.hurtEntity;
    /** @type {EntityHealthComponent} */
    const healthComponent = player.getComponent(EntityHealthComponent.componentId);
    player.nameTag = `${healthComponent.currentValue}`;
    let armorState = getCurrentArmorState(player);

    if (data.damageSource.cause == "freezing" && (JSON.stringify(armorState) == JSON.stringify(iceArmorT1) || JSON.stringify(armorState) == JSON.stringify(iceArmorT2))) {
        /** @type {EntityHealthComponent} */
        const healthComponent = player.getComponent(EntityHealthComponent.componentId);
        healthComponent.setCurrentValue(healthComponent.currentValue + data.damage);
    }

    if (data.damageSource.cause == "magic" && (JSON.stringify(armorState) == JSON.stringify(poisonArmorT1) || JSON.stringify(armorState) == JSON.stringify(poisonArmorT2))) {
        /** @type {EntityHealthComponent} */
        const healthComponent = player.getComponent(EntityHealthComponent.componentId);
        healthComponent.setCurrentValue(healthComponent.currentValue + data.damage);
        player.runCommand("effect @s clear poison")
    }
    if (data.damageSource.cause == "lightning" && (JSON.stringify(armorState) == JSON.stringify(lightningArmorT1) || JSON.stringify(armorState) == JSON.stringify(lightningArmorT2))) {
        /** @type {EntityHealthComponent} */
        player.extinguishFire();
        player.runCommand("effect @s fire_resistance 10 10 true")
        const healthComponent = player.getComponent(EntityHealthComponent.componentId);
        healthComponent.setCurrentValue(healthComponent.currentValue + data.damage);
    }

    if (JSON.stringify(armorState) == JSON.stringify(poisonArmorT2)) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            if (data.damageSource.damagingEntity) {
                data.damageSource.damagingEntity.runCommand("effect @s poison 5 1");
            }
        }
    }
    player = data.damageSource.damagingEntity;
    if (player == null || !player.hasComponent(EntityEquippableComponent.componentId)) return;
    /**@type {EntityEquippableComponent} */
    const equipmentInventory = player.getComponent(EntityEquippableComponent.componentId);
    if (!equipmentInventory) return;
    let equipment = equipmentInventory.getEquipment("Mainhand");

    if ((equipment.typeId == "ck:lightning_dracolyte_sword" || equipment.typeId == "ck:lightning_long_sword") && swordActive) {
        player.runCommand("/tag @e[family=monster] add monster")
        if (data.hurtEntity.hasTag("monster")) {
            data.hurtEntity.runCommand(`/damage @s ${Math.floor(data.damage * 2)}`)
        }
    }
})
world.afterEvents.entityHitEntity.subscribe(data => {
    let player = data.damagingEntity;
    /**@type {EntityEquippableComponent} */
    const equipmentInventory = player.getComponent(EntityEquippableComponent.componentId);
    if (!equipmentInventory) return;

    let equipment = equipmentInventory.getEquipment("Mainhand");

    if ((equipment.typeId == "ck:lightning_long_sword") && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            data.hitEntity.runCommand("/summon lightning_bolt ~~~")
        }
    }

    if ((equipment.typeId == "ck:fire_dracolyte_sword" || equipment.typeId == "ck:fire_long_sword") && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            data.hitEntity.setOnFire(3);
        }
    }

    if (equipment.typeId == "ck:fire_long_sword"  && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            let fireball = player.dimension.spawnEntity("minecraft:fireball", { x: player.getHeadLocation().x + player.getViewDirection().x, y: player.getHeadLocation().y - 1, z: player.getHeadLocation().z+player.getViewDirection().z });
            fireball.applyImpulse(player.getViewDirection());

        }
    }

    if ((equipment.typeId == "ck:ice_dracolyte_sword" || equipment.typeId == "ck:ice_long_sword") && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            data.hitEntity.runCommand("/effect @s slowness 3 1");

        }
    }

    if ((equipment.typeId == "ck:poison_dracolyte_sword" || equipment.typeId == "ck:poison_long_sword") && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            data.hitEntity.runCommand("/effect @s poison 3 1");

        }
    }

    if ((equipment.typeId == "ck:abyssal_dracolyte_sword" || equipment.typeId == "ck:abyssal_long_sword")  && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            data.hitEntity.runCommand("/effect @s wither 2 1");

        }
    }

    if (equipment.typeId == "ck:abyssal_long_sword" && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            let minion = player.dimension.spawnEntity("petyma:zombie_minion", {x: player.location.x + player.getViewDirection().z, y:player.location.y , z: player.location.z-player.getViewDirection().x});
            /** @type {EntityTameableComponent} */
            const tameComponent = minion.getComponent(EntityTameableComponent.componentId);
            tameComponent.tame(player);
        }

    }

    if (equipment.typeId == "ck:poison_long_sword" && swordActive) {
        /** @type {EntityHealthComponent} */
        const healthComponent = player.getComponent(EntityHealthComponent.componentId);
        healthComponent.setCurrentValue(healthComponent.currentValue + 1);
    }

    if (equipment.typeId == "ck:ice_long_sword" && swordActive) {
        let rnd = Math.floor(Math.random() * 4)
        if (rnd == 1) {
            // if (data.hitEntity.typeId == "minecraft:player") {
            //     data.hitEntity.runCommand("/inputpermission set @s movement disabled");
            //     data.hitEntity.runCommand("/inputpermission set @s camera disabled");
            //     data.hitEntity.runCommand("/effect @s weakness 3 255 true");
            //     system.runTimeout(deStunPlayer(data.hitEntity), 3);
            // } else {
            data.hitEntity.runCommand("/effect @s slowness 2 255");
        }
    }
})
system.runTimeout(armorEffects, 20);
