

const Domain = {
	BatDongSan: 1,
  MuaBanNhaDat: 2,
  NhaDat24h: 3,
  ALoNhaDat: 4
};

const DomainName = {
  [Domain.BatDongSan]: 'http://batdongsan.com.vn',
  [Domain.MuaBanNhaDat]: 'http://www.muabannhadat.vn',
  [Domain.NhaDat24h]: 'http://nhadat24h.net',
  [Domain.ALoNhaDat]: 'http://alonhadat.com.vn'
};

const DomainFolder = {
  [Domain.BatDongSan]: 'batdongsan',
  [Domain.MuaBanNhaDat]: 'muabannhadat',
  [Domain.NhaDat24h]: 'nhadat24h',
  [Domain.ALoNhaDat]: 'alonhadat'
};

export {Domain, DomainName, DomainFolder};
