type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiVersion = 'v1' | 'v2';
type Side = 'SELL' | 'BUY';
type WorkingType = 'MARK_PRICE' | 'CONTRACT_PRICE';
type OrderType = 'LIMIT' | 'MARKET' | 'STOP' | 'TAKE_PROFIT' | 'STOP_MARKET' | 'TAKE_PROFIT_MARKET' | 'TRAILING_STOP_MARKET';

export { 
    HttpMethod,
    ApiVersion,
    Side,
    OrderType,
    WorkingType,
};
