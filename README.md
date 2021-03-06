# PadOpt

PadOpt is a free module for ProcessWire (PW), designed to improve e-shops based on PadLoper. Once PadOpt is installed along PadLoper, it is easy to define dozen of options (free or not) with dozen of choices, for every product.

PadLoper is a commercial module for (PW). PadLoper enables to transform any PW-based website to an e-shop, quickly and easily. Every PW page can be transformed into a product, with a price defined in a PW field. If the product presented in the page is available with differents attributes (eg. colors, sizes), each possible combination has to be defined as a variation of the page in PW. But with several choices to do, with several possibilities for each one, the number of variations to create grows exponentially. For this reason, it is not really possible to natively make a shop with high customizable products with PadLoper. PadOpt fixes this issue.

## Installation

Requirements:

- ProcessWire v3.0
- PadLoper v1.3

Installation:

1. Install PadOpt like any other PW module
2. Create or modify a *product template* for PadLoper (see settings of PadCart), and add the *padopt_tpl_id* field
3. On the PHP side of the template, you must have something like:
```
$content .= "<form method='post' class='InputfieldForm padloper-cart-add-product' action='{$config->urls->root}padloper/add/'>";
$content .= $modules->get('PadOpt')->renderFieldset();
$content .= $padopt->getRequiredFieldsErrorPanel(_("<message about required fields not correctly filled"));
$content .= "<input type='submit' name='pad_submit' value='" . __("Add to cart") . "' /></form>";
```
4. You now can create new customizable products, or update already existing ones to complete them with some options

For required fields, you can set a list a strings corresponding to default choices in select fields:
```
$modules->get('PadOpt')->setSelectPromptKeywords(array('choisissez', 'choisir', 'sélectionnez', 'choose', 'select', 'wähle'));
```

Required-if and Show-if features from the PW admin are usable.

## How to Define Options of a Product

Let's take the classical example of the shirts, with these options:

- 3 available colors (extra charge of 10€ for the golden, the two other ones are free)
- free text area to print a name on the back (extra charge of 15€)
- possibility to ask for a gift paper (extra charge of 5€)

Here are the different steps:

1. Create a new template named *padopt_shirts*
2. Create 3 new fields:
  - *padopt_input_shirtColor* (type *Select Options*)
  - *padopt_input_shirtName* (type *Text*)
  - *padopt_input_giftPaper* (type *Checkbox*)
3. Add these 3 new fields to the new template
4. Create a new page associated to a *product template* (see Installation) and select *padopt_shirts* when asked (and set a price, just like any other products)

Respect the prefixes (*padopt_* and *padopt_input_*) in the names. To define the price of the paid options, juste include it in the label of the field, or the title of the choice, following this example: "*Golden (+ 10€)*".

You can now make an order: a list of the selected options will be available directly in your *Padloper Orders* section and the final prices will include the price of the options.

**Bonus:** Fields named *padopt_sep_xxx* (type *Text*) can be added between the other fields, to make separators with labels as titles.

## How to Better Integrate PadOpt

With PadLoper, you are encouraged to customize the templates by copying them from *site/modules/PadLoper/templates/* to *site/templates/padloper/*.

With PadOpt, everywhere there is a *foreach* with PadLoper products taken from *$cart->getCart()*, you can use:

```
list($padopt_url, $padopt_list, $padopt_price) = $modules->get('PadOpt')->getCartProductOptionsInfos($p);
```

When products are taken from *$order->pad_products*, you can use:

```
list($padopt_url, $padopt_list, $padopt_price) = $modules->get('PadOpt')->getOrderProductOptionsInfos($p);
```

- **$p**: PadLoper product (eg. as in *foreach($items as $p)*)
- **$padopt_url**: URL to show the selected options directly from the product page
- **$padopt_list**: HTML list of the chosen options for this product
- **$padopt_price**: Total price of the options (already included in the final price of the product) for this product

Examples of templates to update:

- To show options in carts, update *edit-cart.php*
- To show options in order confirmations and invoices, update *order-products-table.php*

You can also define your own CSS and JS files:

- *site/templates/styles/padopt/padopt.css* and
- *site/templates/scripts/padopt/padopt.js* will be included in all non-admin pages;
- *site/templates/styles/padopt/padopt_product.css* and
- *site/templates/scripts/padopt/padopt_product.js* will be included in all PadOpt product pages.

If you use paid options, you can define 2 areas in your product template, where the total price of the selected options and the final price of the product including chosen options, will be updated with Javascript:

```
$content .= $this->modules->get('PadOpt')->getOptionsTotalPricePanel(__("+ Options:"));
$content .= $this->modules->get('PadOpt')->getFinalPriceWithOptionsPanel(__("Final price with options:"));
```

## PadOpt Submodules

PadOpt supports a submodule system, to easily add features.

To create a new submodule, just create a new PW module with the main class inheriting *PadOptSubmodule*, then register yourself by adding this line in the *init* function:

```
$this->modules->get('PadOpt')->registerSubmodule($this);
```

Install submodules as any other PW module (require PadOpt installed).

### Live Customizers Submodule

This submodule enables to add a client live customization of the product: the image of the product is updated as the customer chooses their options, acting as a preview.

Let's take another example of shirt selling, with a live preview of the colors:

1. Create a new template named *padopt_shirts*
2. Create 2 new fields with a list of colors:
  - *padopt_live_myshirt_bodyColor* (type *Select Options*)
  - *padopt_live_myshirt_sleeveColor* (type *Select Options*)
3. Add these 2 new fields to the new template
4. Create a new page associated to a product template and select *padopt_shirts* when asked
5. Choose a Thumb image for this page: it will be used as a thumbnail in the lists and will be automatically replaced by the default image of the live customizator when opening the page

Let's assume your color lists are:

```
1=red
2=blue
3=pink
```

Create the new directory *site/files/padopt_livecustomizers/myshirt/* and add these files inside:

```
default.png
bodyColor_1.png
bodyColor_2.png
bodyColor_3.png
sleeveColor_1.png
sleeveColor_2.png
sleeveColor_3.png
```

- **default.png**: picture of the shirt with no colors
- **bodyColor_x.png**: picture of the body part of the shirt with the color corresponding to the choice *x* and without the sleeve parts (transparent)
- **sleeveColor_x.png**: picture of the sleeve parts of the shirt with the color corresponding to the choice *x* and without the body part (transparent)

Go on your product page: the preview is here and shows *default.png* by default. One of the *bodyColor* images will be stacked over by changing the value of the corresponding field, and one of the *sleeveColor* will also be stacked over by changing the other one. The shirt in the preview is now full colored.

If you want to add a spinner for the images loading, you can define a style, like in this example:

```
.padopt_livecustomizer_viewport .padopt_spinner {
  width: 71px;
  height: 71px;
  border: 7px solid #fff;
  left: calc(50% - 39px);
  top: calc(50% - 39px);
  background-image: url(/site/templates/styles/logo.svg);
  background-size: contain;
  background-color: #fff;
  border-radius: 50%;
  opacity: .5;
  animation: rotating .7s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
```

## How it Works Behind the Scenes

PadOpt adds two main things to the PadLoper stuff:

1. A column named *padopt_options* to the MySQL table named *padcart*
2. A PW field named *padopt_options* associated to the *padorder_product* template

The db column stores the options associated to the corresponding product in the cart, in PHP's serialization format. The PW field does the same thing, but when the cart is tranform into an order.

All other changes are done on the fly with hooks.

## To Do

- add an options edit link in carts
- add JS live updating of the product price when choosing options
- create a submodule for file uploading

## License

AGPL v3.0
