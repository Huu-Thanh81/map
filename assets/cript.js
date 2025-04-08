//khởi tạo map
const map = L.map("map").setView([10.0218, 105.7846], 13); //13 mức độ thu phóng
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
const customIcon = L.icon({
  iconUrl: "./assets/img/restaurant.png",
  iconSize: [38, 38], //kích thước của icon
});
const customuser = L.icon({
  iconUrl: "./assets/img/hacker.png",
  iconSize: [38, 38], //kích thước của icon
});
//*Câu 1: Xây dựng bản đồ các điểm bán hàng có sẵn
const storeLocations = [
  { name: "Cửa hàng 1", position: [10.0191, 105.7819] },
  { name: "Cửa hàng 2", position: [9.994, 105.71646] },
  { name: "Cửa hàng 3", position: [10.06504, 105.7592] },
  { name: "Cửa hàng 4", position: [10.04156, 105.73774] },
  { name: "Cửa hàng 5", position: [10.0257, 105.6868] },
];
// Thêm các điểm bán hàng lên bản đồ
//*Câu 2:
var standinPoint;
storeLocations.forEach(function (store) {
  const marker = L.marker(store.position, { icon: customIcon })
    .addTo(map)
    .bindPopup(
      `Tọa độ ${store.name}:<br/> (${store.position[0]}, ${store.position[1]})`
    );
  marker.on("click", () => {
    L.Routing.control({
      waypoints: [L.latLng(standinPoint._latlng.lat, standinPoint._latlng.lng), L.latLng(store.position)],
      createMarker: function (i, waypoint, n) {
        return null; // không tạo marker nào cả (ẩn luôn icon mặc định)
      },
    })
      .on("routesfound", function (e) {
        e.routes[0].coordinates.forEach((item, index) => {
          setTimeout(() => {
            standinPoint.setLatLng([item.lat, item.lng]);
          }, index * 30);
        });
        console.log(e);
      })
      .addTo(map);
  });
});
//*Câu 3, 4, 5:
// Chọn hai điểm bất kỳ trên bản đồ
let coordContainer = document.getElementById("coordinates");
let points = [];
let PointerInit;
let count = 0;
map.on("click", (e) => {
    if(!standinPoint){
    standinPoint = L.marker([e.latlng.lat, e.latlng.lng], { icon: customuser })
    .addTo(map)
    .bindPopup(`Điểm đang đứng`);
    funHover(standinPoint);
    return;
  }
  points.push(e.latlng);
  ++count;
  poiAdd(e.latlng.lat, e.latlng.lng);
  funUpdate();
  AppHTML();
});
const funHover = (pointer) => {
  pointer.on("mouseover", function () {
    this.openPopup();
  });
  pointer.on("mouseout", function () {
    this.closePopup();
  });
};
const poiAdd = (lat, lng) => {
  PointerInit = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: "./assets/img/location-mark.png",
      iconSize: [38, 38],
    }),
  })
    .addTo(map)
    .bindPopup(
      `Điểm ${count}<br/>Tọa độ: (${[lat.toFixed(2), lng.toFixed(2)]})`
    );
  funHover(PointerInit);
};
const funUpdate = () => {
  if (points.length >= 2) {
    L.Routing.control({
      waypoints: points,
      routeWhileDragging: true,
      createMarker: function (i, waypoint, n) {
        return null; // không tạo marker nào cả (ẩn luôn icon mặc định)
      },
    })
    .addTo(map);
    console.log(points)
  }
};
//*Câu 7:
const AppHTML = () => {
  var chuoi = "";
  points.forEach((item, index) => {
    chuoi += `<tr>
    <td>${index + 1}</td>
    <td>${item.lat.toFixed(2)}</td>
    <td>${item.lng.toFixed(2)}</td>
  </tr>`;
  });
  var chuoixuli = `
          <table >
            <tr>
              <th>Điểm</th>
              <th>Vĩ Độ</th>
              <th>Kinh Độ</th>
            </tr>
            ${chuoi}
          </table>`;
  coordContainer.innerHTML = chuoixuli;
};
//*Câu 7:
// Nhập tọa độ trực tiếp
function addPoint(Lat, Lng) {
  points.push({ lat: Lat, lng: Lng });
  ++count;
  poiAdd(Lat, Lng);
  funUpdate();
  AppHTML();
}
const handleClick = () => {
  var valuelati = Number(document.querySelector(".container #lat").value);
  var valuelong = Number(document.querySelector(".container #lng").value);
  if (valuelati && valuelong) {
    addPoint(valuelati, valuelong);
  } else {
    alert("Không hợp lệ");
  }
};
const predefinedCoordinates = [
  {coords: [10.031, 105.773] },
  {coords: [10.025, 105.764] },
];
function showSuggestions() {
  const input = document.getElementById("lat").value;
  const suggestionsDiv = document.getElementById("latSuggestions");
  suggestionsDiv.innerHTML = ""; // Xóa các gợi ý cũ
  if (input.trim() !== "") {
      predefinedCoordinates.forEach(item => {
          const value =  item.coords[0].toString();
          if (value.includes(input)) {
            suggestionsDiv .classList.add("suggestions");
              const suggestionItem = document.createElement("div");
              suggestionItem.className = "suggestion-item";
              suggestionItem.innerText = `${item.coords[0]}, ${item.coords[1]}`;
              // Thêm sự kiện click vào gợi ý
              suggestionItem.onclick = function() {
                  document.getElementById("lat").value = item.coords[0];
                  document.getElementById("lng").value = item.coords[1];
                  suggestionsDiv.innerHTML = ""; // Xóa gợi ý sau khi chọn
                  suggestionsDiv .classList.remove("suggestions");
              };
             suggestionsDiv.appendChild(suggestionItem);
            }
          else {
            suggestionsDiv .classList.remove("suggestions");
          }
      });
  }
  else
   suggestionsDiv .classList.remove("suggestions");
}