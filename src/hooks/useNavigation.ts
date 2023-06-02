import {
  ParamListBase,
  useNavigation as useRNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function useNavigation() {
  return useRNavigation<NativeStackNavigationProp<ParamListBase>>();
}
