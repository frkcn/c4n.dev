---
title: Kasiyer Iyzico
description: Kasiyer makes Iyzico's subscription billing services easy and fun for your Laravel application.
date: 09/07/2020
---

* [Introduction](#introduction)  
* [Installation](#installation)  
* [Configuration](#configuration)
    * [Billable Model](#billable-model)  
    * [API Keys](#api-keys)  
    * [Currency Configuration](#currency-configuration)  
* [Customers](#customers)  
    * [Creating Customers](#creating-customers)
    * [Retrieving Customers](#retrieving-customers)
    * [Updating Customers](#updating-customers)
* [Subscriptions](#subscriptions)  
    * [Creating Subscriptions](#creating-subscriptions)
    * [Checking Subscription Status](#checking-subscription-status)
    * [Updating Payment Information](#updating-payment-information)
    * [Retry Payment Attempt](#retry-payment-attempt)
    * [Changing Plans](#changing-plans)
    * [Cancelling Subscriptions](#cancelling-subscriptions)
* [Subscription Trials](#subscription-trials)  
    * [With Payment Method Up Front](#with-payment-method-up-front)
    * [Without Payment Method Up Front](#without-payment-method-up-front)
* [Handling Iyzico Webhooks](#handling-iyzico-webhooks)  
    * [Webhook Event Handlers](#webhook-event-handlers)
    * [Failed Subscriptions](#failed-subscriptions)
* [Single Charges](#charges)  
    * [Simple Charge](#simple-charge)
    * [Refunding Payments](#refunding-payments)
* [Transactions](#transactions)  
    * [Past & Upcoming Payments](#past--upcoming-payments)
* [Testing](#testing)  

## Introduction
> Kasiyer Iyzico is currently in beta. Using Kasiyer Iyzico in production at your own risk. Thanks for your help with testing and reporting bugs.

Kasiyer makes easy Iyzico's subscription billing services for your Laravel application. It handles almost requirements for subscription billing code. In addition to subscription management, Kasiyer also provides swapping subscriptions, cancelling subscription, single charges and refunds.

While using Kasiyer we strongly recommend you also refer to Iyzico's <span class="h">[github page](https://github.com/iyzico/iyzipay-php)</span> and <span class="h">[API documentation](https://dev.iyzipay.com/)</span>

## Installation
Install Kasiyer package with Composer.
```
composer require frkcn/kasiyer
```
### Database Migrations
The Kasiyer service provider registers its own database migration directory. Don't forget to migrate your database after installing the package. The Kasiyer migrations will create a new subscriptions and customers table.
```
php artisan migrate
```

If you need to overwrite the Kasiyer migrations, you can publish them using Artisan command:
```
php artisan vendor:publish --tag="kasiyer-migrations"
```

If you want to prevent Kasiyer's migrations from running entirely, use `ignoreMigrations`. This method should be called in the `register` method of your `AppServiceProvider`:
```php
use Frkcn\Kasiyer\Kasiyer;

Kasiyer::ignoreMigrations();
``` 

## Configuration
### Billable Model
Before using Kasiyer, you must add the Billable trait to your model definition. This trait provides various methods to creating subscriptions, updating payment card, single charge, refund payment.

```php
use Frkcn\Kasiyer\Billable;

class User extends Authenticatable
{
    use Billable;
}
```
You can use any `Authenticatable` model against `App\User` class. That's it, you don't need to change anything else.

### API Keys
Next, you should configure your Iyzico keys in your `.env` file. You can retrieve your Iyzico API keys from the Iyzico merchant panel:
```dotenv
IYZICO_KEY=your-iyzico-private-key
IYZICO_SECRET=your-iyzico-secret-key
```
> Don't forget to change `KASIYER_URL` to production URL in your `.env` file when your code running in production.

```dotenv
KASIYER_URL=iyzico-production-baseurl
```

### Currency Configuration
The default Kasiyer currency is Turkish Liras (TRY). You can change the default currency by setting the `KASIYER_CURRENCY` environment variable.
```dotenv
KASIYER_CURRENCY=USD
```

In addition to configuring Kasiyer's currency, you may also specify a locale to be used for checkout form and responses language.
```dotenv
KASIYER_LOCALE=en
```

## Customers
### Creating Customers
Before creating subscription or single charge, you should create a customer.

```php
$user = User::find(1);

$customer = $user->customer()->create([
    'name' => 'Faruk',
    'surname' => 'Can',
    'gsm_number' => '+905555555555',
    'iyzico_email' => 'faarukcan@gmail.com',
    'identity_number' => '11111111110',
    'shipping_contact_name' => 'Faruk Can',
    'shipping_city' => 'Istanbul',
    'shipping_country' => 'Turkey',
    'shipping_address' => 'Nisbetiye Cad. No:4',
    'shipping_zip_code' => '34340',
    'billing_contact_name' => 'Faruk Can',
    'billing_city' => 'Istanbul',
    'billing_country' => 'Turkey',
    'billing_address' => 'Nisbetiye Cad. No:4',
    'billing_zip_code' => '34340',
]);
```

### Retrieving Customers
You may use the asIyzicoCustomer method if you want to return the customer object if the customer entity is already a customer within Iyzico.
```php
$iyzicoCustomer = $user->asIyzicoCustomer();
```

### Updating Customers
When you update your customer, Kasiyer will automatically update the customer within Iyzico.
```php
$iyzicoCustomer = $user->customer()
    ->update([$options]);
```

## Subscriptions
### Creating Subscriptions
Most interactions with Iyzico are done through <span class="h">[its checkout form](https://dev.iyzipay.com/en/checkout-form)</span>. To create a subscription, first retrieve an instance of your billable model, which will be an instance of `App\User`. Once you have retrieved the model instance, you may use the `newSubscription` method to create the model's subscription checkout form:
```php
$user = User::find(1);

$checkoutForm = $user->newSubscription('default', $default = 'ba304be8-f17a-4f23-8500-f7d47b6927a1')
    ->returnTo(route('home'))
    ->create();

return view('billing', ['checkoutForm' => $checkoutForm]);
```
This response will give you an htmlContent. As soon as you print it into your web-page, the javascript will load
iyzico’s libraries and checkout form will be ready. The content of form will be loaded into one of divs below.
```html
<div id="iyzipay-checkout-form" class="responsive"></div>
```
If you want to show checkout form on pop-up. Add below code:
```html
<div id="iyzipay-checkout-form" class="popup"></div>
```
Once the user submitted the checkout form, user will be redirected to `returnTo` URL. At the same time, a
post request containing the token will be sent to this URL. You should send another request to check whether
the subscription is successfully started or not.
```php
$user = User::find(1);

$user->handleSubscription($request->token);
```
> For more information about checkout form result, consult <span class="h">[Iyzico's subscription api](https://dev.iyzipay.com/en/subscription/SubscriptionApi.pdf)</span>.

### Checking Subscription Status
Once a user is subscribed to your application, you may check their subscription status using a variety of convenient methods. First, the `subscribed` method returns `true` if the user has an active subscription, even if the subscription is currently within its trial period:
```php
if ($user->subscribed('default')) {
    //
}
```
You can use `subscribed` method for allowing you to filter access to routes and controllers based on the user's subscription status within `route middleware`:
```php
public function handle($request, Closure $next)
{
    if ($request->user() && !$request->user()->subscribed('default')) {
        // This user is not a paying customer.
        return redirect('billing');
    }

    return $next($request);
}
``` 

If you want to show your users that they are still on their trial period:
```php
if ($user->subscription('default')->onTrial()) {
    //
}
```
If you would like to know a user subscribed to given plan based on a given Iyzico plan ID:
```php
if ($user->subscribedToPlan($monthly = 'ba304be8-f17a-4f23-8500-f7d47b6927a1', 'default')) {
    //
}
```
The `recurring` method may be used to determine if the user is currently subscribed and is no longer within their trial period.
```php
if ($user->subscription('default')->recurring()) {
    //
}
```
#### Cancelled Subscription Status
To determine if the user was once an active subscriber, but has cancelled their subscription, you may use the `cancelled` method:
```php
if ($user->subscription('default')->cancelled()) {
    //
}
```
You may also determine if a user has cancelled their subscription, but are still on their "grace period" until the subscription fully expires. For example, if a user cancels a subscription on March 5th that was originally scheduled to expire on March 10th, the user is on their "grace period" until March 10th. Note that the subscribed method still returns true during this time:
```php
if ($user->subscription('default')->onGracePeriod()) {
    //
}
```
To determine if the user has cancelled their subscription and is no longer within their "grace period", you may use the `ended` method:
```php
if ($user->subscription('default')->ended()) {
    //
}
```

#### Subscription Scopes
Most subscription states are also available as query scopes so that you may easily query your database for subscriptions that are in a given state:
```php
// Get all active subscriptions...
$subscriptions = Subscription::query()->active()->get();

// Get all of the cancelled subscriptions for a user...
$subscriptions = $user->subscriptions()->cancelled()->get();
```
A complete list of available scopes is available below:
```php
Subscription::query()->active();
Subscription::query()->onTrial();
Subscription::query()->notOnTrial();
Subscription::query()->pastDue();
Subscription::query()->recurring();
Subscription::query()->ended();
Subscription::query()->cancelled();
Subscription::query()->notCancelled();
Subscription::query()->onGracePeriod();
Subscription::query()->notOnGracePeriod();
```

#### Past Due Status
If a payment fails for a subscription, it will be marked as `past_due`. When your subscription is in this state it will not be active until you <span class="h">[retry payment attempt](#retry-payment-attempt)</span> and result returns `true`. You may determine if a subscription is past due using the `pastDue` method on the subscription instance:
```php
if ($user->subscription('default')->pastDue()) {
    //
}
```
When a subscription is past due, you should instruct the user to <span class="h">[update their payment information](#updating-payment-information)</span> or make sure there is enough limit on your customer's card.

If you would like subscriptions to still be considered active when they are `past_due`, you may use the `keepPastDueSubscriptionsActive` method provided by Kasiyer. Typically, this method should be called in the `register` method of your `AppServiceProvider`:
```php
use Frkcn\Kasiyer\Kasiyer;

/**
 * Register any application services.
 *
 * @return void
 */
public function register()
{
    Kasiyer::keepPastDueSubscriptionsActive();
}
```
> When a subscription is in a `past_due` state it cannot be changed until you retry payment attempt successfully. Therefore, the `swap` methods will throw an exception when the subscription is in a `past_due` state.

### Updating Payment Information
In some situations(geting payment errors, card expiration, etc.) customers may need to update the card
information. This method allows customers to create a checkout form to update the card. The new card is
validated with a charge of 1 TL (USD, EUR) and this amount is refunded immediately.
```php
$user = User::find(1);

$updateCheckoutForm = $user->subscription('default')
            ->returnTo(route('home'))
            ->cardUpdate();
```
This response will give you an htmlContent. As soon as you print it into your web-page, the javascript will load iyzico’s libraries and checkout form will be ready. The content of form will be loaded into one of divs below.
```html
<div id="iyzipay-checkout-form" class="responsive"></div>
```
Once the user submitted the update checkout form, user will be redirected to returnTo URL. This method will post a token to the specified `returnTo` URL if the status is `success`, it means that the card is
successfully updated.

### Retry Payment Attempt
If a payment of a recurring payment is not `successful`, this method retries payment attempt.
```php
$user = User::find(1);

$user->subscription('default')->retry();
```

### Changing Plans
After a user has subscribed to your application, they may occasionally want to change to a new subscription plan. To swap a user to a new subscription, you should pass the Iyzico plan's identifier to the subscription's `swap` method:
```php
$user = User::find(1);

$user->subscription('default')->swap($premium = 'ba304be8-f17a-4f23-8500-f7d47b6927a1');
```
If the user is on trial, the trial period will be maintained.  
If you would like to swap plans and cancel any trial period the user is currently on, you may use the skipTrial method:
```php
$user = User::find(1);

$user->subscription('default')
    ->skipTrial()
    ->swap($premium = 'ba304be8-f17a-4f23-8500-f7d47b6927a1');
```
If you want to update plan name when swapping plan, simply update:
```php
$subscription->update([
    'name' => 'premium',
]);
```

> Customers can change the pricing plan of a subscription if only they are configured under the same product.  
  Note: `PaymentInterval` and `PaymentIntervalCount` of new and old pricing plans must be same.

### Cancelling Subscriptions
To cancel a subscription, call the `cancel` method on the user's subscription:
```php
$user = User::find(1);

$user->subscription('default')->cancel();
```
When a subscription `is cancelled`, Kasiyer will automatically set the `ends_at` column in your database. This column is used to know when the `subscribed` method should begin returning `false`. For example, if a customer cancels a subscription on March 1st, but the subscription was not scheduled to end until March 5th, the subscribed method will continue to return `true` until March 5th.

You may determine if a user has `cancelled` their subscription but are still on their "grace period" using the `onGracePeriod` method:
```php
if ($user->subscription('default')->onGracePeriod()) {
    //
}
```
If you wish to cancel a subscription immediately, you may call the `cancelNow` method on the user's subscription:
```php
$user->subscription('default')->cancelNow();
```
> Iyzico's subscriptions cannot be resumed after cancellation. If your customer wishes to resume their subscription, they will have to subscribe to a new subscription.

## Subscriptions Trials
### With Payment Method Up Front
Yo must to define how many trial days your plan's receive in the Iyzico merchant dashboard. Kasiyer automatically detect if subscription plan has trials.

> If the customer's subscription is not cancelled before the trial ending date they will be charged as soon as the trial expires, so you should be sure to notify your users of their trial ending date.

You may determine if the user is within their trial period using either the `onTrial` method of the user instance or the `onTrial` method of the subscription instance. The two examples below have identical behavior:
```php
if ($user->onTrial('default')) {
    //
}

if ($user->subscription('default')->onTrial()) {
    //
}
```
### Without Payment Method Up Front
If you would like to offer trial periods without collecting the user's payment method information up front, you may set the `trial_ends_at` column on the customer record to your desired trial ending date. This is typically done during `customer` creation:
```php
$user = User::find(1);

$user = $user->customer()->create([
    // Other user properties...
    'trial_ends_at' => now()->addDays(10),
]);
```
Kasiyer refers to this type of trial as a "generic trial", since it is not attached to any existing subscription. The `onTrial` method on the User instance will return true if the current date is not past the value of `trial_ends_at`:
```php
if ($user->onTrial()) {
    // User is within their trial period...
}
```
You may also use the `onGenericTrial` method if you wish to know specifically that the user is within their "generic" trial period and has not created an actual subscription yet:
```php
if ($user->onGenericTrial()) {
    // User is within their "generic" trial period...
}
```
Once you are ready to create an actual subscription for the user, you may use the `newSubscription` method as usual:
```php
$user = User::find(1);

$checkoutForm = $user->newSubscription('default', $default = 'ba304be8-f17a-4f23-8500-f7d47b6927a1')
    ->returnTo(route('home'))
    ->create();

return view('billing', ['checkoutForm' => $checkoutForm]);
```
> There is no way to extend or modify a trial period on a Iyzico subscription after it has been created.

## Handling Iyzico Webhooks
Iyzico can notify your application of `SubscriptionOrderSuccess` and `SubscriptionOrderFailed` events via webhooks. By default, a route that points to Kasiyer's webhook controller is configured through the Kasiyer service provider. This controller will handle all incoming webhook requests.  

To ensure your application can handle Iyzico webhooks, be sure to configure the webhook URL in the Iyzico merchant control panel or contact Iyzico entegration support. By default, Kasiyer's webhook controller listens to the `/iyzico/webhook` URL path. The full list of all webhooks you should configure in the Iyzico control panel are:

1. Subscription Order Success
2. Subscription Order Failed

### Webhook Event Handlers
Kasiyer emits a `Frkcn\Kasiyer\Events\WebhookReceived` event when a webhook is received, and a `Frkcn\Kasiyer\Events\WebhookHandled` event when a webhook was handled. Both events contain the full payload of the Iyzico webhook.

#### Webhooks & CSRF Protection
Since Iyzico webhooks need to bypass Laravel's CSRF protection, be sure to list the URI as an exception in your `VerifyCsrfToken` middleware or list the route outside of the `web` middleware group:
```php
protected $except = [
    'iyzipay/*',
];
```

### Failed Subscriptions
What if a customer's credit card expires? No worries - Kasiyer's Webhook controller will change the customer's subscription status to `pastDue` for you. Failed payments will automatically be captured and handled by the controller. The controller will change the customer's subscription status to `pastDue` when Iyzico determines the subscription has failed.
> Iyzico only one time attempt to charging subscription payment. You need to decide to cancelling subscription or not after payment failed.

## Single Charges
### Simple Charge
If you would like to make a "one off" charge against a customer, you may use the charge method on a billable model instance to generate a checkout form for the charge. The charge method accepts the charge amount (float) or (integer) as its first argument and a charge description as its second argument:

```php
$user = User::find(1);

$checkoutForm = $user->setBasketItem([
    'id' => 'A123',
    'name' => 'Product Title',
    'category' => 'Product Category',
    'price' => 12.99,
])
    ->returnTo(route('home'))
    ->charge();

return view('pay', ['checkoutForm' => $checkoutForm]);
```

After generating the checkout form, this response will give you an htmlContent. As soon as you print it into your web-page, the javascript will load iyzico’s libraries and checkout form will be ready. The content of form will be loaded into one of divs below.

```html
<div id="iyzipay-checkout-form" class="responsive"></div>
```
If you want to show checkout form on pop-up. Add below code:
```html
<div id="iyzipay-checkout-form" class="popup"></div>
```
Once the user submitted the checkout form, user will be redirected to returnTo URL. At the same time, a post request containing the token will be sent to this URL. You should send another request to check whether the charge is successfully started or not.
```php
$result = $user->handleCharge($request->token);
```
Charges happen in the currency specified in the `kasiyer.currency` configuration option. By default, this is set to TRY. You may override the default currency by setting the `KASIYER_CURRENCY` in your `.env` file:
```dotenv
KASIYER_CURRENCY=USD
```
> Still you need to <span class="h">[create a customer](#creating-customers)</span> with shipping and billing information before charging process.

### Refunding Payments
If you need to refund a Iyzico payment, you may use the `refund` method. This method accepts the Iyzico Payment ID as its first argument.
```php
$user->refund("12222108");
```
You may also optionally specify a specific amount to refund as well as a reason for the refund:
```php
$user->refund(
    "12222108", 5.00, 'Unused product time'
);
```

## Transactions
You may easily retrieve an array of a billable model's subscription transactions using the `transactions` method:
```php
$transactions = $user->transactions();
```
When listing the transactions for the customer, you may use the transaction's helper methods to display the relevant transaction information. For example, you may wish to list every transaction in a table.
```php
<table>
    @foreach ($transactions as $transaction)
        <tr>
            <td>{{ $transaction->date()->toFormattedDateString() }}</td>
            <td>{{ $transaction->amount() }}</td>
            <td>{{ $transaction->currency() }}</td>
            <td>{{ $transaction->status() }}</td>
        </tr>
    @endforeach
</table>
```
### Past & Upcoming Payments
You may use the `lastPayment` and `nextPayment` methods to display a customer's past or upcoming payments for recurring subscriptions:
```php
$subscription = $user->subscription('default');

$lastPayment = $subscription->lastPayment();
$nextPayment = $subscription->nextPayment();
```
Both of these methods will return an instance of Frkcn\Kasiyer\Payment; however, `nextPayment` will return null when the billing cycle has ended (such as when a subscription has been cancelled):
```php
Next payment: {{ $nextPayment->amount() }} due on {{ $nextPayment->date()->format('d/m/Y') }}
```

## Testing
Be sure using sandbox cridentials when testing.
> In order to test a variety of billing scenarios, such as credit card denials and failures, you may use the vast range of <span class="h">[testing card numbers](https://dev.iyzipay.com/en/test-kartlari)</span> provided by Iyzico.
