// Trie node for efficient word and prefix checking
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Check if a prefix can lead to any valid word
  hasPrefix(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }

  // Check if the string is a complete valid word
  isWord(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }
}

// Common English words dictionary
// In a production app, you'd load this from a file
const WORDS = [
  'car', 'care', 'card', 'cards', 'cat', 'cats', 'cart', 'carts',
  'bat', 'bats', 'bat', 'ball', 'balls', 'bat', 'bar', 'bars',
  'rat', 'rats', 'rate', 'rates', 'ration', 'rations',
  'dog', 'dogs', 'dot', 'dots', 'done', 'do',
  'run', 'runs', 'rune', 'runes', 'rust', 'ruin', 'ruins',
  'sun', 'suns', 'sung', 'stung', 'stun', 'stuns',
  'fun', 'fund', 'funds', 'fungi', 'funs',
  'gun', 'guns', 'gust', 'gusts',
  'art', 'arts', 'artist', 'artists', 'are', 'arm', 'arms',
  'star', 'stars', 'start', 'starts', 'stark', 'stare', 'stares',
  'part', 'parts', 'party', 'par', 'park', 'parks',
  'dart', 'darts', 'dark', 'dare', 'dares',
  'tar', 'tars', 'target', 'targets', 'tart', 'tarts',
  'can', 'cane', 'canes', 'candy', 'cans', 'cant',
  'ban', 'band', 'bands', 'bane', 'banes', 'bans',
  'pan', 'pane', 'panes', 'pans', 'pant', 'pants',
  'man', 'mane', 'manes', 'mans', 'many', 'mania',
  'fan', 'fans', 'fang', 'fangs', 'fancy',
  'tan', 'tank', 'tanks', 'tang', 'tans',
  'van', 'vans', 'vane', 'vanes', 'vanish',
  'hat', 'hate', 'hates', 'hater', 'haters', 'hats',
  'mat', 'mate', 'mates', 'mats', 'math', 'mating',
  'sat', 'sate', 'satin', 'sating',
  'fat', 'fate', 'fates', 'fats', 'fatal',
  'pat', 'pate', 'pates', 'pats', 'patent', 'patents',
  'rat', 'rate', 'rates', 'rats', 'rating', 'ratings',
  'the', 'then', 'them', 'theme', 'themes', 'these',
  'she', 'shed', 'shell', 'shells', 'shelf', 'shelve', 'shelves',
  'he', 'her', 'here', 'hers', 'hero', 'heros', 'heron', 'herons',
  'me', 'men', 'mend', 'mends', 'menu', 'menus',
  'be', 'bed', 'beds', 'bee', 'bees', 'been', 'beer', 'beers',
  'we', 'wed', 'weds', 'wee', 'week', 'weeks', 'weeds',
  'see', 'seed', 'seeds', 'seek', 'seeks', 'seen', 'seer', 'seers',
  'and', 'ant', 'ants', 'any',
  'end', 'ends', 'enter', 'enters',
  'or', 'ore', 'ores', 'order', 'orders',
  'for', 'fore', 'forest', 'forests', 'form', 'forms', 'fort', 'forts',
  'not', 'note', 'notes', 'nothing', 'notion', 'notions',
  'hot', 'hotel', 'hotels', 'hots',
  'pot', 'pots', 'potion', 'potions',
  'lot', 'lots', 'lotion', 'lotions',
  'got', 'goats',
  'in', 'ink', 'inks', 'into',
  'win', 'wind', 'winds', 'wine', 'wines', 'wing', 'wings', 'wins',
  'tin', 'tins', 'tint', 'tints', 'tiny',
  'pin', 'pine', 'pines', 'pins', 'pink', 'pinks', 'pint', 'pints',
  'sin', 'sine', 'sines', 'sing', 'sings', 'sink', 'sinks', 'sins',
  'bin', 'bind', 'binds', 'bins',
  'at', 'ate', 'atom', 'atoms',
  'on', 'one', 'ones', 'only',
  'to', 'toe', 'toes', 'ton', 'tons', 'tone', 'tones', 'top', 'tops',
  'go', 'goes', 'gone', 'goat', 'goats', 'goal', 'goals', 'god', 'gods',
  'no', 'nod', 'nods', 'node', 'nodes', 'nor', 'norm', 'norms', 'nose', 'noses', 'not',
  'so', 'son', 'sons', 'song', 'songs', 'sort', 'sorts', 'sore', 'sores',
  'set', 'sets', 'send', 'sends', 'sent',
  'get', 'gets', 'gent', 'gents',
  'let', 'lets',
  'met', 'metal', 'metals',
  'net', 'nets',
  'pet', 'pets', 'petal', 'petals',
  'vet', 'vets',
  'wet', 'wets',
  'yet',
  'all', 'ally',
  'ball', 'balls',
  'call', 'calls',
  'fall', 'falls',
  'hall', 'halls',
  'mall', 'malls',
  'tall',
  'wall', 'walls',
  'bell', 'bells',
  'cell', 'cells',
  'dell', 'dells',
  'fell', 'fells',
  'hell', 'hells',
  'jell', 'jells',
  'sell', 'sells',
  'tell', 'tells',
  'well', 'wells',
  'yell', 'yells',
  'bill', 'bills',
  'fill', 'fills',
  'gill', 'gills',
  'hill', 'hills',
  'kill', 'kills',
  'mill', 'mills',
  'pill', 'pills',
  'sill', 'sills',
  'till', 'tills',
  'will', 'wills',
  'bull', 'bulls',
  'dull', 'dulls',
  'full',
  'gull', 'gulls',
  'hull', 'hulls',
  'lull', 'lulls',
  'mull', 'mulls',
  'null', 'nulls',
  'pull', 'pulls',
  'are', 'area', 'areas',
  'ear', 'earl', 'earls', 'earn', 'earns', 'ears', 'early',
  'pear', 'pears', 'pearl', 'pearls',
  'dear', 'dears',
  'fear', 'fears',
  'gear', 'gears',
  'hear', 'heard', 'hears', 'heart', 'hearts',
  'near', 'nears', 'nearly',
  'rear', 'rears',
  'sear', 'sears', 'search',
  'tear', 'tears',
  'wear', 'wears',
  'year', 'years', 'yearn', 'yearns',
  'air', 'airs', 'airy',
  'fair', 'fairs', 'fairy',
  'hair', 'hairs', 'hairy',
  'pair', 'pairs',
  'stair', 'stairs',
  'chair', 'chairs',
  'old', 'olds',
  'bold',
  'cold', 'colds',
  'fold', 'folds',
  'gold', 'golds',
  'hold', 'holds',
  'mold', 'molds',
  'sold',
  'told',
  'out', 'outs',
  'bout', 'bouts',
  'pout', 'pouts',
  'rout', 'routs', 'route', 'routes',
  'shout', 'shouts',
  'scout', 'scouts',
  'snout', 'snouts',
  'stout', 'stouts',
  'trout', 'trouts',
  'about',
];

// Create and populate the Trie
export const dictionary = new Trie();
WORDS.forEach(word => dictionary.insert(word));

// Helper functions
export const isValidPrefix = (prefix) => {
  if (!prefix) return true;
  return dictionary.hasPrefix(prefix);
};

export const isValidWord = (word) => {
  if (!word) return false;
  return dictionary.isWord(word);
};

export const isDeadEnd = (sequence) => {
  if (!sequence) return false;
  return !dictionary.hasPrefix(sequence);
};
