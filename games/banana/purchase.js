function purchase(item) {
    document.getElementById('clicksound').play()
    logverbose("Purchacing " + item)
    switch (item) {
      case 'bananacrate':
        if (points >= price_bananacrate) {
          buildings_bananacrate ++
          points -= price_bananacrate
          // bpc ++
          price_bananacrate = Math.floor(price_bananacrate * 1.2)
          updatepricetags(); updatebulidingcounts()
        }
        break;
      case 'bananatree':
        if (points >= price_bananatrees) {
          buildings_bananatrees ++
          points -= price_bananatrees
          // bpc ++; bpc ++
          price_bananatrees = Math.floor(price_bananatrees * 1.2)
          updatepricetags(); updatebulidingcounts()
        }
        break;
      case 'monkey':
       if (points >= price_monkeys) {  
           buildings_monkeys ++
           points -= price_monkeys
          //  bpc ++; bpc ++; bpc++; bpc ++; bpc++; bpc ++; bpc ++; bpc++; bpc ++; bpc++;
           price_monkeys = Math.floor(price_monkeys * 1.2)
           updatepricetags(); updatebulidingcounts()
          }
       break;
       case 'magikgrow':
        if (points >= price_monkeys) {     
            buildings_magikgrow ++
            points -= price_magikgrow
            // addtobpc(20)
            price_magikgrow = Math.floor(price_magikgrow * 1.2)
            updatepricetags(); updatebulidingcounts()
          }
        break;
        case 'forest':
          if (points >= price_forest) {
              buildings_forest ++
              points -= price_forest
              // addtobpc(50)
              price_forest = Math.floor(price_forest * 1.2)
              updatepricetags(); updatebulidingcounts()
            }
        break;
        case 'machine':
          if (points >= price_machine) {
            buildings_machine ++
            points -= price_machine
            // addtobpc(75)
            price_machine = Math.floor(price_machine * 1.2)
            updatepricetags(); updatebulidingcounts()
          }
          break;
        case 'box':
          if (points >= price_box) {
            buildings_box ++
            points -= price_box
            // addtobpc(125)
            price_box = Math.floor(price_box * 1.2)
            updatepricetags(); updatebulidingcounts()
          }
          break;
        case 'wizard':
          if (points >= price_wizard) {
            buildings_wizard ++
            points -= price_wizard
            price_wizard = Math.floor(price_wizard * 1.2)
            updatepricetags(); updatebulidingcounts()
          }
        break;
      default:
        break;
    }
  }