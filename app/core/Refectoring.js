/**
 * Created by user on 14-5-14.
 */

(function(){
    var PlayerFacets = function(name){
        this.name = name;
    }

    PlayerFacets.prototype = {
        talents: function(value) {
            this.talents = value;
            return this;
        },
        mentality: function(value) {
            this.mentality = value;
            return this;
        }
    }

    var tom = new PlayerFacets("Tom").talents(11).mentality(22);
    console.log(tom);
    console.log(tom.talents);
})();

/**
 *
 *
 double totalAmount = 0;
 int frequentRenterPoints = 0;
 Enumeration rentalsEnums = rentals.elements();
 String result = "Rental record for:" + this.getName() + "\n";
 while(rentalsEnums.hasMoreElements()){
			double thisAmount = 0;
			Rental each = (Rental)rentalsEnums.nextElement();

			switch(each.getMovie().getPriceCode()){
				case Movie.REGULAR:
					thisAmount +=2;
					if(each.getDaysRented() > 2){
						thisAmount += (each.getDaysRented() - 2) * 1.5;
					}
					break;
				case Movie.NEW_RELEASE:
					thisAmount += each.getDaysRented() * 3;
					break;
				case Movie.CHILDREN:
					thisAmount += 1.5;
					if(each.getDaysRented() > 3){
						thisAmount +=(each.getDaysRented() - 3) * 1.5;
					}
					break;
			}

			frequentRenterPoints ++;
			if(each.getMovie().getPriceCode() == Movie.NEW_RELEASE && each.getDaysRented() > 1){
				frequentRenterPoints ++;
			}
			result += "\t" + each.getMovie().getTitle() + "\t" + String.valueOf(thisAmount) + "\n";
			totalAmount += thisAmount;
		};

 result += "Amount owed is " + String.valueOf(totalAmount) + "\n";
 result += "You earned " + String.valueOf(frequentRenterPoints) + " frequent renter points";
 return result;
 *
 */

var Rental = function(amount) {
    this.amount = amount;
}

var rentals = [new Rental(33), new Rental(44), new Rental(55)];
var total = 0;
rentals.forEach(function(el, index, array) {
    total += el.amount;
});
console.log(total);