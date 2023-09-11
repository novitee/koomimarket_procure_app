import React from 'react';
import Container from 'components/Container';
import useMe from 'hooks/useMe';
import Text from 'components/Text';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'configs/colors';
import {Linking, TouchableOpacity, View} from 'react-native';
import SendIcon from 'assets/images/send-circle.svg';
import {WHATSAPP_NUMBER} from 'configs/index';
import Toast from 'react-native-simple-toast';

export default function SupportScreen() {
  const {user} = useMe();
  const {fullName} = user?.me || {};

  async function gotoWhatsApp() {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}`;
    const supported = await Linking.canOpenURL(url);

    try {
      if (supported) {
        await Linking.openURL(url);
      } else {
        Toast.show('WhatsApp is not installed', Toast.LONG);
      }
    } catch (error) {
      Toast.show(
        'An error occurred while trying to open WhatsApp. Please try again later.',
        Toast.LONG,
      );
    }
  }
  return (
    <LinearGradient
      className="flex-1"
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      locations={[0, 0.9]}
      colors={['#FFFFFF', colors.primary.DEFAULT]}>
      <Container containerClassName="bg-transparent" className="bg-transparent">
        <Text className="text-32 font-medium mt-8">
          Hi {fullName} {String.fromCodePoint(128075)}
        </Text>
        <Text className="text-32 font-medium">How can we help?</Text>

        <TouchableOpacity
          className="bg-white py-4 px-5 rounded-lg justify-between flex-row items-center mt-10"
          onPress={gotoWhatsApp}>
          <View className="flex flex-col flex-1 mr-4">
            <Text className="font-bold">Send us a message</Text>
            <Text className="text-gray-500 mt-2">
              We typically reply in a few minutes.
            </Text>
            <Text className="text-gray-500 mt-2">
              Our Support hours are Monday - Friday 9am - 6pm (GMT +8)
            </Text>
          </View>
          <SendIcon />
        </TouchableOpacity>
      </Container>
    </LinearGradient>
  );
}
