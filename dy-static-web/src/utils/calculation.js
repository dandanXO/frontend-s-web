import * as _ from "lodash";

//计算组选时的注数为多少。
export const generateGroupBetCount = (num_list1, num_list2, style) => {
  var count = 0;
  if (style == "FiveStar_ZX120") {
    if (num_list1.length < 5) {
      return 0;
    }
    count = combinations(num_list1.length, 5);
  } else if (style == "FiveStar_ZX60") {
    if (num_list2.length < 3 || num_list1.length < 1) {
      return 0;
    }
    let union_count = _.union(num_list1, num_list2);
    let same_num = num_list1.length + num_list2.length - union_count.length;

    count = combinations(num_list1.length, 1) * combinations(num_list2.length, 3) - (same_num * combinations((num_list2.length - 1), 2));

  } else if (style == "FiveStar_ZX30") {

    if (num_list1.length < 2 || num_list2.length < 1) {
      return 0;
    }
    let union_count = _.union(num_list1, num_list2);
    let same_num = num_list1.length + num_list2.length - union_count.length;

    count = combinations(num_list1.length, 2) * combinations(num_list2.length, 1) - (same_num * combinations((num_list2.length - 1), 1));


  } else if (style == "FiveStar_ZX20") {

    if (num_list1.length < 1 || num_list2.length < 2) {
      return 0;
    }
    let union_count = _.union(num_list1, num_list2);
    let same_num = num_list1.length + num_list2.length - union_count.length;

    count = combinations(num_list1.length, 1) * combinations(num_list2.length, 2) - (same_num * combinations((num_list2.length - 1), 1));


  } else if (style == "FiveStar_ZX10") {

    if (num_list1.length < 1 || num_list2.length < 1) {
      return 0;
    }
    let union_count = _.union(num_list1, num_list2);
    let same_num = num_list1.length + num_list2.length - union_count.length;

    count = combinations(num_list1.length, 1) * combinations(num_list2.length, 1) - (same_num);


  } else if (style == "FiveStar_ZX5") {

    if (num_list1.length < 1 || num_list2.length < 1) {
      return 0;
    }
    let union_count = _.union(num_list1, num_list2);
    let same_num = num_list1.length + num_list2.length - union_count.length;

    count = combinations(num_list1.length, 1) * combinations(num_list2.length, 1) - (same_num);


  }
  return count;
};

//公式表：
//A为第一排选择的号码数，B为第二排选择的号码数。重复=A与B之间重复过的数字数量。
//C是高级数学里的’组合Combination‘函数。
//组选120公式： (A)C5
//组选60公式： (A)C1 * (B)C3 - (重复 * (B - 1)C2))
//组选30公式： (A)C2 * (B)C1 - (重复 * (A - 1)C1))
//组选20公式： (A)C1 * (B)C2 - (重复 * (B - 1)C1))
//组选10公式： (A)C1 * (B)C1 - (重复 * 1)
//组选5公式： (A)C1 * (B)C1 - (重复 * 1)

function product_Range(a, b) {
  var prd = a, i = a;

  while (i++ < b) {
    prd *= i;
  }
  return prd;
}

//组选计算公式
export const combinations = (n, r) => {
  if (n == r || r == 0) {
    return 1;
  } else {
    r = (r < n - r) ? n - r : r;
    return product_Range(r + 1, n) / product_Range(1, n - r);
  }
};
