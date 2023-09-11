import React from 'react';
import Container from 'components/Container';
import useMe from 'hooks/useMe';
import Text from 'components/Text';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'configs/colors';
import {TouchableOpacity, View} from 'react-native';
import SendIcon from 'assets/images/send-circle.svg';
export default function SupportScreen() {
  const {user} = useMe();
  const {fullName} = user?.me || {};

  function gotoWhapsApp() {}
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

        <TouchableOpacity className="bg-white" onPress={gotoWhapsApp}>
          <View>
            <Text>Send us a message</Text>
            <Text>We typically reply in a few minutes.</Text>
            <Text>
              Our Support hours are Monday - Friday 9am - 6pm (GMT +8)
            </Text>
          </View>
          <SendIcon />
        </TouchableOpacity>
      </Container>
    </LinearGradient>
  );
}
