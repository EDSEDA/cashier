import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ctx } from './App';
import React from 'react';
import { Item } from './Store';

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
    color: 'red',
    textDecorationStyle: 'solid',
  },
});

interface CardProps {
    item: Item;
}

const Card = ({ item }: CardProps) => {
    const { ctrl } = React.useContext(Ctx);

    return (
        <View onTouchStart={() => ctrl.onItemChoose(item.id)}>
            {item.tag && (
                <Text>
                    {item.tag}
                </Text>
            )}
            <Image src={item.imageSrc}/>
            <Text>
                {item.name}
            </Text>
            <View>
                <Text style={[styles.price, styles.__invalid]}>
                    {item.price}
                </Text>
                <Text>
                    {item.oldPrice}
                </Text>
            </View>
        </View>
    );
};


export const RecommendationPage = observer(() => {
    const { store } = React.useContext(Ctx);

    return (
        <SafeAreaView>
            <StatusBar barStyle='light-content'/>
            <View>
                <View>
                    <Text style={styles.header}>
                        Специально для вас
                    </Text>
                    <Image src=""/>
                </View>
    
                {store.items?.map(item => <Card key={item.id} item={item}/>)}
                {!store.items && (
                    <Text>
                        Loading...
                    </Text>
                )}
    
                <View>
                    <Text>
                        *Детали персональнального предложения уточните у продавца
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
});
