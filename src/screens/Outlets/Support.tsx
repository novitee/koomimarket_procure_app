import React from 'react';
import Container from 'components/Container';
import useMe from 'hooks/useMe';
import Text from 'components/Text';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'configs/colors';

export default function SupportScreen() {
  const {user} = useMe();
  const {fullName} = user?.me || {};
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
      </Container>
    </LinearGradient>
  );
}
