class Information {
  private info : HTMLElement | null;
  constructor() {
    this.info = document.getElementById('info');
  }

  show(message : string) {
    if (this.info) {
      this.info.innerHTML = message;
    }
  }
}

class Result {
  private result : HTMLDivElement | null;
  constructor() {
    this.result = document.getElementById('result') as HTMLDivElement;
  }

  add(card : string) {
    if (this.result) {
      const img : HTMLImageElement = document.createElement('img');
      img.src = `../cards/${card}.svg`;
      img.width = 150;
      this.result.appendChild(img);
    }
  }
}


class Group {
  private group : HTMLDivElement | null;
  private cards : string[];
  constructor(number : number, deck: Deck) {
    this.cards = [];
    this.group = document.getElementById(`group${number}`) as HTMLDivElement;
    if (this.group) {
      this.group.addEventListener('mouseenter', handleMouseEnter.bind(null, this));
      this.group.addEventListener('mouseleave', handleMouseLeave.bind(null, this));
      this.group.addEventListener('mousedown', handleMouseDown.bind(null, number, deck));
    }
  }

  add(card : string) {
    if (this.group) {
      this.cards.push(card);
      const img : HTMLImageElement = document.createElement('img');
      img.src = `../cards/${card}.svg`;
      img.width = 150;
      this.group.appendChild(img);
    }
  }

  clear() {
    if (this.group) {
      this.cards = [];
      while (this.group.firstChild) {
        this.group.removeChild(this.group.firstChild);
      }
    }
  }

  count() : number {
    if (this.group) {
      return this.group.childElementCount;
    }

    return 0;
  }

  getCards() : string[] {
    return this.cards;
  }

  showFocus() {
    if (this.group) {
      this.group.classList.add('highlight');
    }
  }

  hideFocus() {
    if (this.group) {
      this.group.classList.remove('highlight');
    }
  }

  hide() {
    if (this.group) {
      this.clear();
      this.group.classList.add('hide');
    }
  }
}

function handleMouseEnter(group: Group, event: MouseEvent) {
  group?.showFocus();
}

function handleMouseLeave(group: Group, event: MouseEvent) {
  group?.hideFocus();
}

function handleMouseDown(choice: number, deck: Deck, event: MouseEvent) {
  deck?.shuffle(choice);
}

class Deck {
  private cards : string[] = [
    "front_club_ace",
    "front_club_2",
    "front_club_3",
    "front_club_4",
    "front_club_5",
    "front_club_6",
    "front_club_7",
    "front_club_8",
    "front_club_9",
    "front_club_10",
    "front_club_jack",
    "front_club_queen",
    "front_club_king",
    "front_diamond_ace",
    "front_diamond_2",
    "front_diamond_3",
    "front_diamond_4",
    "front_diamond_5",
    "front_diamond_6",
    "front_diamond_7",
    "front_diamond_8",
    "front_diamond_9",
    "front_diamond_10",
    "front_diamond_jack",
    "front_diamond_queen",
    "front_diamond_king",
    "front_heart_ace",
    "front_heart_2",
    "front_heart_3",
    "front_heart_4",
    "front_heart_5",
    "front_heart_6",
    "front_heart_7",
    "front_heart_8",
    "front_heart_9",
    "front_heart_10",
    "front_heart_jack",
    "front_heart_queen",
    "front_heart_king",
    "front_spades_ace",
    "front_spades_2",
    "front_spades_3",
    "front_spades_4",
    "front_spades_5",
    "front_spades_6",
    "front_spades_7",
    "front_spades_8",
    "front_spades_9",
    "front_spades_10",
    "front_spades_jack",
    "front_spades_queen",
    "front_spades_king",
  ];
  private selectedCards: string[];
  private group1 : Group;
  private group2 : Group;
  private group3 : Group;
  private result : Result;
  private info : Information;
  private shuffleCount;

  constructor() {
    this.shuffleCount = 0;
    this.selectedCards = [];
    this.info = new Information();
    this.result = new Result();
    this.group1 = new Group(1, this);
    this.group2 = new Group(2, this);
    this.group3 = new Group(3, this);
  }

  shuffle(choice?: number) {
    switch (this.shuffleCount) {
      case 0:
        this.info.show('Select a card and click on the group to which it belongs.');
        this.randomizeCards();
        this.loadCards();
        break;

      case 1:
        this.info.show('Great job! Now, click again on the group where your selected card is located.');
        this.reorganize(choice as number);
        this.loadCards();
        break;

      case 2:
        this.info.show('Fantastic! We are almost there. Do it one more time!');
        this.reorganize(choice as number);
        this.loadCards();
        break;

      case 3:
        this.info.show('Is this your card?');
        this.reorganize(choice as number);
        this.group1.hide();
        this.group2.hide();
        this.group3.hide();
        this.result.add(this.selectedCards[10]);
      default:
        break;
    }

    this.shuffleCount++;
  }

  private randomCard() : string {
    var random = Math.floor(Math.random() * this.cards.length);
    return this.cards[random];
  }

  private randomizeCards() {
    for (let i = 0; i < 21; i++) {
      var card = this.randomCard();
      while (this.selectedCards.includes(card)) {
        card = this.randomCard();
      }

      this.selectedCards.push(card);
    }

    this.selectedCards = this.selectedCards;
  }

  private loadCards() {
    this.group1.clear();
    this.group2.clear();
    this.group3.clear();
    for (let i = 0; i < 21; i+=3) {
      this.group1.add(this.selectedCards[i]);
      this.group2.add(this.selectedCards[i+1]);
      this.group3.add(this.selectedCards[i+2]);
    }
  }

  private reorganize(choice: number) {
    const g1: string[] = this.group1.getCards();
    const g2: string[] = this.group2.getCards();
    const g3: string[] = this.group3.getCards();

    switch (choice) {
      case 1:
        this.selectedCards = [...g2, ...g1, ...g3];
        break;

      case 2:
        this.selectedCards = [...g1, ...g2, ...g3];
        break;

      case 3:
        this.selectedCards = [...g1, ...g3, ...g2];
        break;
    }
  }
}

const deck = new Deck();
deck.shuffle();