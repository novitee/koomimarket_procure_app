export type IMessageItem = {
  id: string;
  text?: string;
  type:
    | 'order_card'
    | 'text'
    | 'photo'
    | 'attachment'
    | 'group_notification'
    | 'document';
  createdAt: Date;
  attachmentObject?: any;
  status: 'unsent' | 'sent' | 'seen';
  channelId: string;
  msgIndex?: number;
  checkSum?: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  clientMsgId?: string;
};

export type IUser = {
  id: string;
  name: string;
  avatar?: {
    url: string;
  };
  fullName?: string;
};
interface IMember extends IUser {
  lastSeenMsgIndex?: number;
  objectType: 'CUSTOMER' | 'SUPPLIER';
  objectId: string;
  objectName: string;
  photo?: {
    url: string;
  };
  userId: string;
  outlet?: {
    entityName: string;
    entityId: string;
    address?: {
      mobileCode?: string;
      mobileNumber?: string;
    };
  };
  user?: IUser;
  role?: String;
}
interface ITyping {
  objectId: string;
  objectName: string;
  photo?: {
    url: string;
  };
  user?: IUser;
}

export type IChannelItem = {
  id: string;
  name: string;
  photo?: {url: string};
  lastMessage: IMessageItem;
  channelMembers: IMember[];
  typing?: ITyping[];
  unreadMessage: number;
  customerOutletName?: string;
  // customerName?: string
  channelName?: string;
  customerOutlet: {
    id: string;
    name: string;
    entityName: string;
    entityId: string;
    address?: {
      mobileCode?: string;
      mobileNumber?: string;
    };
    photo?: {
      url: string;
    };
  };
};
