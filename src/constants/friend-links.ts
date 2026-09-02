export type FriendLink = {
  name: string;
  link: string;
  description?: string;
  avatar?: string;
};

/**
 * Friend links shown in the navigation dropdown.
 * Not expected to change frequently.
 */
export const FRIEND_LINKS: FriendLink[] = [
  {
    name: "XPoet",
    link: "https://xpoet.cn/",
    description: "所有命运的馈赠，早已在暗中标好价格。",
    avatar: "https://cdn.jsdelivr.net/gh/XPoet/image-hosting@master/common-use/avatar.jpg",
  },
  {
    name: "薇拉航线",
    link: "https://www.zuozuovera.com/",
    description: "computer scientist",
  },
];
