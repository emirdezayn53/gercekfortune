// ===== COD Profit Simulation Engine =====

function getInputs() {
    return {
        productCost: parseFloat(document.getElementById('productCost').value) || 0,
        adCost: parseFloat(document.getElementById('adCost').value) || 0,
        sellingPrice: parseFloat(document.getElementById('sellingPrice').value) || 0,
        deliveryRate: parseFloat(document.getElementById('deliveryRate').value) || 0,
        shippingDelivered: parseFloat(document.getElementById('shippingDelivered').value) || 0,
        shippingReturned: parseFloat(document.getElementById('shippingReturned').value) || 0,
        ordersSent: parseInt(document.getElementById('ordersSent').value) || 0,
    };
}

function computeForRate(inputs, ordersSent, deliveryRate) {
    const rate = deliveryRate / 100;
    const delivered = Math.round(ordersSent * rate);
    const undelivered = ordersSent - delivered;

    const revenue = delivered * inputs.sellingPrice;
    const productCostTotal = delivered * inputs.productCost;
    const adCostTotal = ordersSent * inputs.adCost;
    const shippingDelTotal = delivered * inputs.shippingDelivered;
    const shippingRetTotal = undelivered * (inputs.shippingDelivered + inputs.shippingReturned);
    const shippingTotal = shippingDelTotal + shippingRetTotal;
    const totalCost = productCostTotal + adCostTotal + shippingTotal;
    const netProfit = revenue - totalCost;
    const profitPerDelivered = delivered > 0 ? netProfit / delivered : 0;
    const profitPerSent = ordersSent > 0 ? netProfit / ordersSent : 0;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
        ordersSent, delivered, undelivered, deliveryRate,
        revenue, productCostTotal, adCostTotal,
        shippingDelTotal, shippingRetTotal, shippingTotal,
        totalCost, netProfit, profitPerDelivered, profitPerSent, margin,
    };
}

function computeBreakEven(inputs, ordersSent) {
    // Revenue = D * SP
    // Cost = D * PC + N * AC + D * SD + (N - D) * (SD + SR)
    // At break-even: Revenue = Cost
    // D * (SP - PC + SR) = N * (AC + SD + SR)
    // delivery_rate = D / N = (AC + SD + SR) / (SP - PC + SR)

    const numerator = inputs.adCost + inputs.shippingDelivered + inputs.shippingReturned;
    const denominator = inputs.sellingPrice - inputs.productCost + inputs.shippingReturned;

    if (denominator <= 0) return null; // impossible to break even
    const beRate = (numerator / denominator) * 100;
    return beRate;
}

function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(n) {
    return n.toLocaleString('en-US');
}

function calculate() {
    const inputs = getInputs();
    const ordersSent = inputs.ordersSent;
    const r = computeForRate(inputs, ordersSent, inputs.deliveryRate);

    // Sync slider
    document.getElementById('deliveryRateSlider').value = inputs.deliveryRate;

    // ---- KPI Cards ----
    document.getElementById('kpiRevenue').textContent = fmt(r.revenue);
    document.getElementById('kpiCost').textContent = fmt(r.totalCost);
    document.getElementById('kpiProfit').textContent = fmt(r.netProfit);
    document.getElementById('kpiProfit').style.color = r.netProfit >= 0 ? 'var(--green)' : 'var(--red)';
    document.getElementById('kpiMargin').textContent = r.margin.toFixed(1) + '%';
    document.getElementById('kpiMargin').style.color = r.margin >= 0 ? 'var(--gold)' : 'var(--red)';

    // ---- Delivery Results ----
    document.getElementById('resSent').textContent = fmtInt(r.ordersSent);
    document.getElementById('resDelivered').textContent = fmtInt(r.delivered);
    document.getElementById('resUndelivered').textContent = fmtInt(r.undelivered);
    document.getElementById('resDeliveryRate').textContent = r.deliveryRate + '%';

    // ---- Revenue ----
    document.getElementById('resAOV').textContent = fmt(inputs.sellingPrice);
    document.getElementById('resDelForRev').textContent = fmtInt(r.delivered);
    document.getElementById('resTotalRev').innerHTML = '<strong>' + fmt(r.revenue) + '</strong>';

    // ---- Cost Breakdown ----
    document.getElementById('costProdFormula').textContent = fmtInt(r.delivered) + ' × ' + fmt(inputs.productCost);
    document.getElementById('costProd').textContent = fmt(r.productCostTotal);

    document.getElementById('costAdFormula').textContent = fmtInt(r.ordersSent) + ' × ' + fmt(inputs.adCost);
    document.getElementById('costAd').textContent = fmt(r.adCostTotal);

    document.getElementById('costShipDelFormula').textContent = fmtInt(r.delivered) + ' × ' + fmt(inputs.shippingDelivered);
    document.getElementById('costShipDel').textContent = fmt(r.shippingDelTotal);

    document.getElementById('costShipRetFormula').textContent = fmtInt(r.undelivered) + ' × (' + fmt(inputs.shippingDelivered) + ' + ' + fmt(inputs.shippingReturned) + ')';
    document.getElementById('costShipRet').textContent = fmt(r.shippingRetTotal);

    document.getElementById('costShipTotal').textContent = fmt(r.shippingTotal);
    document.getElementById('costTotal').innerHTML = '<strong>' + fmt(r.totalCost) + '</strong>';

    // ---- Profit Summary ----
    document.getElementById('profitRev').textContent = fmt(r.revenue);
    document.getElementById('profitCost').textContent = fmt(r.totalCost);

    const netEl = document.getElementById('profitNet');
    netEl.innerHTML = '<strong>' + fmt(r.netProfit) + '</strong>';
    netEl.style.color = r.netProfit >= 0 ? 'var(--green)' : 'var(--red)';

    document.getElementById('profitPerDel').textContent = fmt(r.profitPerDelivered);
    document.getElementById('profitPerDel').style.color = r.profitPerDelivered >= 0 ? 'var(--green)' : 'var(--red)';
    document.getElementById('profitPerSent').textContent = fmt(r.profitPerSent);
    document.getElementById('profitPerSent').style.color = r.profitPerSent >= 0 ? 'var(--green)' : 'var(--red)';
    document.getElementById('profitMargin').textContent = r.margin.toFixed(1) + '%';
    document.getElementById('profitMargin').style.color = r.margin >= 0 ? 'var(--green)' : 'var(--red)';

    // ---- Break-Even ----
    updateBreakEven(inputs, ordersSent, inputs.deliveryRate);

    // ---- Sensitivity ----
    updateSensitivity(inputs, ordersSent, inputs.deliveryRate);
}

function updateBreakEven(inputs, ordersSent, currentRate) {
    const beRate = computeBreakEven(inputs, ordersSent);
    const ring = document.getElementById('beRing');
    const percentEl = document.getElementById('bePercent');
    const descEl = document.getElementById('beDescription');
    const statusEl = document.getElementById('beStatus');
    const circumference = 2 * Math.PI * 52; // r=52

    if (beRate === null || beRate > 100) {
        percentEl.textContent = 'N/A';
        ring.style.strokeDashoffset = circumference;
        ring.style.stroke = 'var(--red)';
        percentEl.style.color = 'var(--red)';
        descEl.textContent = 'It is impossible to break even with the current cost structure. The selling price does not cover per-unit costs even at 100% delivery.';
        statusEl.className = 'be-status loss';
        statusEl.textContent = '✕ Cannot break even';
        return;
    }

    const offset = circumference - (beRate / 100) * circumference;
    ring.style.strokeDashoffset = offset;

    percentEl.textContent = beRate.toFixed(1) + '%';

    if (currentRate > beRate) {
        ring.style.stroke = 'var(--green)';
        percentEl.style.color = 'var(--green)';
        descEl.textContent = `You need at least ${beRate.toFixed(1)}% delivery rate to break even. Your current rate of ${currentRate}% is ${(currentRate - beRate).toFixed(1)} percentage points above break-even.`;
        statusEl.className = 'be-status profitable';
        statusEl.textContent = '✓ Currently Profitable';
    } else if (currentRate < beRate) {
        ring.style.stroke = 'var(--red)';
        percentEl.style.color = 'var(--red)';
        descEl.textContent = `You need at least ${beRate.toFixed(1)}% delivery rate to break even. Your current rate of ${currentRate}% is ${(beRate - currentRate).toFixed(1)} percentage points below break-even.`;
        statusEl.className = 'be-status loss';
        statusEl.textContent = '✕ Currently at Loss';
    } else {
        ring.style.stroke = 'var(--amber)';
        percentEl.style.color = 'var(--amber)';
        descEl.textContent = `You are exactly at the break-even point. Any decrease in delivery rate will result in a loss.`;
        statusEl.className = 'be-status breakeven-exact';
        statusEl.textContent = '⚬ Exactly at Break-Even';
    }
}

function updateSensitivity(inputs, ordersSent, currentRate) {
    const tbody = document.getElementById('sensitivityBody');
    tbody.innerHTML = '';

    for (let rate = 60; rate <= 90; rate += 5) {
        const s = computeForRate(inputs, ordersSent, rate);
        const isCurrent = (rate === Math.round(currentRate));
        const tr = document.createElement('tr');
        if (isCurrent) tr.classList.add('row-current');

        const profitClass = s.netProfit >= 0 ? 'profit-positive' : 'profit-negative';

        tr.innerHTML = `
      <td><strong>${rate}%</strong>${isCurrent ? ' <span style="color:var(--blue);font-size:0.7rem;">● CURRENT</span>' : ''}</td>
      <td>${fmtInt(s.delivered)}</td>
      <td>${fmtInt(s.undelivered)}</td>
      <td>${fmt(s.revenue)}</td>
      <td>${fmt(s.totalCost)}</td>
      <td class="${profitClass}"><strong>${fmt(s.netProfit)}</strong></td>
      <td class="${profitClass}">${fmt(s.profitPerDelivered)}</td>
      <td class="${profitClass}">${fmt(s.profitPerSent)}</td>
      <td class="${profitClass}">${s.margin.toFixed(1)}%</td>
    `;
        tbody.appendChild(tr);
    }
}

function simulate(count) {
    document.getElementById('ordersSent').value = count;
    calculate();

    // Scroll to KPI section smoothly
    document.querySelector('.kpi-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetDefaults() {
    document.getElementById('productCost').value = 8;
    document.getElementById('adCost').value = 5;
    document.getElementById('sellingPrice').value = 30;
    document.getElementById('deliveryRate').value = 70;
    document.getElementById('shippingDelivered').value = 3;
    document.getElementById('shippingReturned').value = 2;
    document.getElementById('ordersSent').value = 500;
    calculate();
}

// Initial calculation on page load
document.addEventListener('DOMContentLoaded', calculate);
