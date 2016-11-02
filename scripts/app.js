Number.prototype.toReadable = function(){
  return String(this).replace(/(\d)(?=(\d{3})+$)/g,"$1,");
};

(function() {

  CountryComparer = {
    init: function(){
      this.renderCountriesFromTemplate();
      this.fetchAllCountries();
      this.initializeModal();
      this.bindEditCountryTriggerLinks();
      this.bindCountrySearchForm();
    },
    bindCountrySearchForm: function(){
      $("#country-name").keyup(function(){
        var searchTerm = $(this).val().toLowerCase();
        $("#edit-country-modal .collection-item").each(function(index,element){
          var element = $(element);
          var countryName = element.text().toLowerCase();
          if(countryName.indexOf(searchTerm) == -1){
            element.addClass("hide");
          } else{
            element.removeClass("hide");
          }
        });
      });
    },
    bindEditCountryTriggerLinks: function(){
      var that = this;
      $(".country .modal-trigger").click(function(ev){
        ev.preventDefault();
        that.currentEditingCountryIndex = parseInt(this.dataset.countryIndex);
        $("#edit-country-modal").modal("open");
      });
    },
    bindModalLinks: function(){
      var that = this;
      $("#edit-country-modal .collection-item").click(function(ev){
        ev.preventDefault();
        var countryCode = this.dataset.countryCode;
        $("#edit-country-modal").modal("close");
        that.renderCountry(countryCode);
      });
    },
    fetchAllCountries: function(){
      var that = this;
      $.ajax({
        url: "https://restcountries.eu/rest/v1/all"
      }).done(function(data){
        console.log(data);
        that.allCountries = data;
        that.populateModalContent();
        that.bindModalLinks();
        that.currentEditingCountryIndex = 0;
        that.renderCountry("JPN");
        that.currentEditingCountryIndex = 1;
        that.renderCountry("IND");
        that.showMainContent();
      });
    },
    fetchCountryByCode: function(countryCode){
      var match;
      var allCountries = this.allCountries;

      for(var i = 0; i < allCountries.length; i++){
        var country = allCountries[i];
        if(country.alpha3Code === countryCode ){
          match = country;
          break;
        }
      }
      return match;
    },
    initializeModal: function(){
      $('.modal').modal();
    },
    populateModalContent: function(){
      var links = "";
      this.allCountries.forEach(function(country){
        links += "<a href='#' class='collection-item' data-country-code='" + country.alpha3Code +"'>" + country.alpha3Code + " - " + country.name + "</a>";
      });
      $("#edit-country-modal .collection").html(links);
    },
    renderCountriesFromTemplate: function(){
      var template = $("#countryTemplate").html();
      $("#countries").html(Mustache.render(template, {countryIndex: 0}) + Mustache.render(template, {countryIndex: 1}));
    },
    renderCountry: function(countryCode){
      var country = this.fetchCountryByCode(countryCode);
      $("#country-" + this.currentEditingCountryIndex + " h2 .code").html(country.alpha3Code);
      $("#country-" + this.currentEditingCountryIndex + " p.name").html(country.name);
      $("#country-" + this.currentEditingCountryIndex + " .population p").html(country.population.toReadable());
      $("#country-" + this.currentEditingCountryIndex + " .area p").html(country.area.toReadable() + "<span class='units'>km<sup>2</sup></span>");
      var populationDensity = parseInt(country.population/country.area);
      $("#country-" + this.currentEditingCountryIndex + " .population-density p").html(populationDensity.toReadable() + "<span class='units'>people/km<sup>2</sup></span>");
      $("#country-" + this.currentEditingCountryIndex + " .gini p").html(country.gini || "N/A");
    },
    showMainContent: function(){
      $("#loader").addClass("hide");
      $("#content").removeClass("hide");
    }
  };

  $(document).ready(function(){
    CountryComparer.init();
  });
})();
