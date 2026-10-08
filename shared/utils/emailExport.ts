import type { Offer, OfferLine } from '../types';
import { calcLine } from './calc';
import { PRODUCT_MAP } from './products';
import { fmt } from './calc';

export const generateEmailText = (offer: Offer, loms: any[]): string => {
  const date = new Date(offer.date).toLocaleDateString('cs-CZ');
  const validUntil = new Date(
    new Date(offer.date).getTime() + offer.validDays * 86400000
  ).toLocaleDateString('cs-CZ');

  let text = `Vážený zákazníku,\n\n`;
  text += `zasílám Vám cenovou nabídku na žulový materiál.\n\n`;
  text += `Zákazník: ${offer.customer}\n`;
  text += `Datum:    ${date}\n`;
  text += `Platnost: ${validUntil}\n\n`;
  text += `${'─'.repeat(60)}\n`;
  text += `POLOŽKY NABÍDKY\n`;
  text += `${'─'.repeat(60)}\n\n`;

  for (const line of offer.lines) {
    if (!line.quantity || !line.productCode) continue;
    const prod = PRODUCT_MAP.get(line.productCode);
    const name = line.customName || prod?.name || line.productCode;
    const calc = calcLine(line, offer.params, loms);

    text += `${name}\n`;
    text += `  Množství:      ${fmt.num(line.quantity, 1)} ${line.unit}\n`;
    text += `  Cena/j:        ${fmt.czk(calc.priceWithMargin)}\n`;
    text += `  Celkem:        ${fmt.czk(calc.totalCzk)}\n\n`;
  }

  text += `${'─'.repeat(60)}\n`;
  text += `CELKOVÁ CENA:  ${fmt.czk(offer.totalCzk)}\n`;
  text += `${'─'.repeat(60)}\n\n`;
  text += `Ceny jsou uvedeny včetně dopravy, bez DPH.\n`;
  text += `Kurz PLN/CZK: ${offer.params.exchangeRate}\n\n`;
  text += `V případě zájmu nebo dotazů jsem Vám plně k dispozici.\n\n`;
  text += `S pozdravem\n`;

  return text;
};
