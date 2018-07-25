export default {
  /**
   *
   * @param {Array} area
   */
  formatArea(area) {
    var result = {
      province_id: area[0],
      city_id: area[1],
      county_id: area[2]
    };
    return result;
  }
};
