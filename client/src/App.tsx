import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  header: {
    fontWeight: '700',
    fontSize: 48,
    lineHeight: 58,
    color: '#3872FF',
  },
  price: {
    fontWeight: '400',
    fontSize: 38,
    lineHeight: 48,
    color: '#3872FF',
  },
  __invalid: {
    color: '#3872FF',
    textDecoration: 'line-through',
  },
  price: {
    fontWeight: '400',
    fontSize: 38,
    lineHeight: 48,
    color: '#3872FF',
  },
  {
      font-family: Montserrat;
      font-size: 20.03px;
      font-weight: 500;
      line-height: 24.41px;
      text-align: left;
  },
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundImage: '',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <View>
            <Text style={styles.header}>
                Специально для вас
            </Text>
            <Image src=""/>
        </View>
        <View>
            <Text>
                -50%
            </Text>
            <Image src=""/>
            <Text>
                Хот-дог с кетчупом
            </Text>
            <View>
                <Text style={[styles.price, styles.__invalid]}>
                    89 ₽
                </Text>
                <Text>
                    178 ₽
                </Text>
            </View>
        </View>

        <View>
            <Text>
                *Детали персональнального предложения уточните у продавца
            </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
