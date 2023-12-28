from flask import Blueprint, jsonify
import stripe
from decouple import config

# Acceder a las variables de entorno como si fueran variables normales de Python
stripe.api_key = config("STRIPE_SECRET_KEY_TEST")
# stripe.api_key = config("STRIPE_SECRET_KEY_LIVE")

consultas_Stripe_blueprint = Blueprint('consultas_Stripe', __name__)

# Devolver al cliente la clave publica
@consultas_Stripe_blueprint.route('/config', methods=['GET'])
def stripe_config():
  return jsonify({'publishableKey': config("STRIPE_PUBLISHABLE_TEST")}), 200
  # return jsonify({'publishableKey': config("STRIPE_PUBLISHABLE_LIVE")}), 200

# Crear intento de pago
@consultas_Stripe_blueprint.route('/create-payment-intent', methods=['POST'])
def stripe_create_payment_intent():
  try:
    amount = 200
    currency = 'eur'
    automatic_payment_method = True

    intent = stripe.PaymentIntent.create(
      amount=amount,
      currency=currency,
      payment_method_types=['card'],
      confirmation_method='automatic' if automatic_payment_method else 'manual',
    )

    return jsonify({'clientSecret': intent.client_secret})

  except Exception as e:
      return jsonify(error=str(e)), 400