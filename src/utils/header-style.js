import React from 'react'
import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = getStatusBarHeight()

const DEFAULT_HEADER_STYLE = {
  headerTitle: "",
  headerStyle: {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    alignSelf: 'center',
  },
  headerLeftContainerStyle: {
    paddingLeft: 20,
  },
  headerRightContainerStyle: {
    paddingRight: 20,
  }
}

const PADDING_CONTENT = 10

const PADDING_HEADER = (HEADER_HEIGHT = 80) => Platform.OS === "ios" 
                        ? (HEADER_HEIGHT - STATUSBAR_HEIGHT + PADDING_CONTENT) 
                        : (HEADER_HEIGHT + PADDING_CONTENT)

export {
  DEFAULT_HEADER_STYLE, PADDING_HEADER, PADDING_CONTENT
}