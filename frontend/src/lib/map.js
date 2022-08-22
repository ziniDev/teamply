export  async function serachAddress (query, page=1, size=10) {
    if (query == undefined || query == "") {
      return new Promise(function(resolve, reject) {
        reject({ "message": "검색할 주소를 입력 해 주세요." });
      });
    }

    let option 	= makeRequestHeader();
    let url 	= makeRequestURL(
      "search/address.json",
      {
        query 		: query,
        page 		: page,
        size		: size > 30 ? 30 : size
      }
    );

    return requestDaumAPI(url, option);
  }

  export  async function getCoordToAddress (latitude, longitude, input_coord="WGS84") {
		if (latitude == undefined || latitude == "") {
			return new Promise(function(resolve, reject) {
				reject({ "message": "위도 값을 입력 해 주세요." });
			});
		}
		if (longitude == undefined || longitude == "") {
			return new Promise(function(resolve, reject) {
				reject({ "message": "경도 값을 입력 해 주세요." });
			});
		}

		let option 	= makeRequestHeader();
		let url 	= makeRequestURL(
						"geo/coord2address.json",
						{
							x 			: longitude,
							y 			: latitude,
							input_coord	: input_coord
						}
					);

		return requestDaumAPI(url, option);
	}

  export function requestDaumAPI (url, option) {
    return new Promise(function(success, failed) {
      let errorFlag = false;

      fetch("https://dapi.kakao.com/v2/local/" + url, option)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          failed({ "message": "Server request error" });
        }
      })
      .then((responseJson) => {
        if (!errorFlag) success(responseJson);
      })
      .catch((error) => {
        errorFlag = true;
        failed(error);
      });
    });
  }

  function makeRequestHeader () {
    let option = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Authorization': 'KakaoAK ' + "a8ed166c9b1d8fe3b35d09b4408b492f"
      }
    };

    return option;
  }

  function makeRequestURL (url, params) {
    if (params != undefined && typeof(params) === 'object') {
      let paramUrl = '';
      for (let key in params) {
        let concatStr = (paramUrl.length == 0) ? '?' : '&';
        paramUrl += concatStr + key + "=" + params[key];
      }

      url += paramUrl;
    }

    return url;
  }