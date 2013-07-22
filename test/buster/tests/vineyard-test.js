// Generated by CoffeeScript 1.3.3

buster.testCase("Arbor", {
  "sort vines": function() {
    var properties, result;
    properties = {
      c: {
        name: "c"
      },
      d: {
        name: "d",
        weight: 50
      },
      a: {
        name: "a"
      },
      b: {
        name: "b",
        weight: -1
      }
    };
    result = Arbor.sort_vines(properties);
    assert.equals(result[0].name, "b");
    assert.equals(result[1].name, "c");
    assert.equals(result[2].name, "a");
    return assert.equals(result[3].name, "d");
  },
  "seed cache": function() {
    var bow, orion, vineyard;
    vineyard = Vineyard.create(test_model.trellises);
    orion = vineyard.trellises.warrior.create_seed({
      id: 10,
      name: "Orion"
    });
    bow = vineyard.trellises.character_item.create_seed({
      id: 3,
      owner: 10,
      name: "bow"
    });
    assert.isObject(bow.owner);
    return assert.equals(bow.owner.name, "Orion");
  },
  "seed cache override": function() {
    var bow, item_trellis, orion, vineyard, warrior_trellis;
    vineyard = Vineyard.create(test_model.trellises);
    warrior_trellis = vineyard.trellises.warrior;
    item_trellis = vineyard.trellises.character_item;
    bow = item_trellis.create_seed({
      id: 3,
      owner: 10,
      name: "bow"
    });
    orion = warrior_trellis.create_seed({
      id: 10,
      name: "Orion"
    });
    assert.equals(warrior_trellis.get_connections("seed").length, 1);
    return assert.equals(warrior_trellis.get_connections("seed")[0].name, "Orion");
  },
  "seed cache embedded": function() {
    var item_trellis, items, orion, vineyard, warrior_trellis, warriors;
    vineyard = Vineyard.create(test_model.trellises);
    warrior_trellis = vineyard.trellises.warrior;
    item_trellis = vineyard.trellises.character_item;
    orion = warrior_trellis.create_seed({
      id: 10,
      name: "Orion",
      inventory: [
        {
          id: 3,
          owner: 10,
          name: "bow"
        }
      ]
    });
    warriors = warrior_trellis.get_connections("seed");
    items = item_trellis.get_connections("seed");
    assert.equals(warriors.length, 1);
    assert.equals(items.length, 1);
    assert.equals(warriors[0].name, "Orion");
    assert.equals(items[0].name, "bow");
    refute.same(warriors[0]._plantable, false);
    return refute.same(items[0]._plantable, false);
  }
});

buster.testCase('Trellis', {
  setUp: function() {
    return this.vineyard = Vineyard.create(test_model.trellises);
  },
  is_a: function() {
    var base, warrior;
    warrior = this.vineyard.trellises['warrior'];
    base = this.vineyard.trellises['base'];
    assert(warrior.is_a('base'));
    assert(warrior.is_a('warrior'));
    assert(warrior.is_a(base));
    assert(base.is_a(base));
    refute(warrior.is_a('frog'));
    return refute(base.is_a('warrior'));
  }
});

buster.testCase('Seed', {
  setUp: function() {
    return this.vineyard = Vineyard.create(test_model.trellises);
  },
  create_seed: function() {
    var seed;
    seed = this.vineyard.trellises.character_item.create_seed({
      name: 'orc slayer',
      owner: 10
    });
    assert.equals(seed.name, 'orc slayer');
    refute(seed._is_proxy, 'main seed is not marked proxy');
    assert(seed.owner._is_proxy, 'sub object is marked proxy');
    seed = this.vineyard.trellises.warrior.create_seed({
      race: 'orc',
      inventory: [30]
    });
    assert.equals(seed.race, 'orc');
    refute(seed._is_proxy, 'main seed is not marked proxy');
    assert.equals(seed.inventory[0].id, 30);
    return assert(seed.inventory[0]._is_proxy, 'sub object is marked proxy');
  },
  prepare_for_planting: function() {
    var orc, seed, sword, trellis;
    trellis = this.vineyard.trellises.warrior;
    sword = this.vineyard.trellises.character_item.create_seed({
      name: 'orc slayer'
    });
    orc = trellis.create_seed({
      race: 'orc'
    });
    sword.owner = orc;
    orc.inventory = [sword];
    seed = Seed.prepare_for_planting(orc, trellis);
    console.log(seed);
    assert.equals('orc slayer', seed.inventory[0].name);
    return assert.equals('undefined', typeof seed.inventory[0].owner);
  }
});
