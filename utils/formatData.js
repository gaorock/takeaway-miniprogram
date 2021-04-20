function formatData (data) {
  const {cate, shop, mj} = data;

  const catelist = []; 
  const products_table = {};
  
  const products = cate.map(c => {
    // separate cate name into its own list for left menu
    if (c.goods.length > 0) catelist.push({id: c.id, name: c.name});
    
    // split price into yuan, fen
    c.goods = c.goods.map(p => {
      
      p.multi = p.param_type === 2;
      
      products_table[p.id] = p;

      p.yan = p.price.slice(0,2);
      p.fen = p.price.slice(2);
      
      return p
    })
    return c
  }).filter(c => c.goods.length !== 0)

  const coupon = mj.map(m => {
    const money = m.money.split('.');
    const limit = m.at_least.split('.');

    return {money: money[0], limit: limit[0]}
  })

  return {
    cate: catelist,
    products: products,
    shop: {
      name: shop.shop_name,
      logo: shop.shop_logo,
      bg: shop.shop_index_logo,
      notice: shop.notice, 
      time: `${shop.start.slice(0, 5)} -- ${shop.end.slice(0, 5)}`
    },
    coupon: coupon,
    productsTable: products_table
  }
}

module.exports = formatData;