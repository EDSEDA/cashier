import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    ImageBackground,
    TextInput,
    Button,
    ImageSourcePropType,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ctx } from './App';
import React from 'react';
import { Item } from './utils/Store';

const styles = StyleSheet.create({
    socketUrlForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    container: {
        height: '100%',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 30,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header_text: {
        fontWeight: '700',
        fontSize: 48,
        lineHeight: 58,
        color: '#3872FF',
        width: 500,
    },
    items: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 30,
    },
    item: {
        flexGrow: 1,
        padding: 20,
        flexDirection: 'column',
        flex: 1,
        flexShrink: 0,
        flexBasis: 0,
        gap: 25,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3872FF',
    },
    item_img: {
        width: 'auto',
        height: 200,
    },
    item_text: {
        fontSize: 20,
        fontWeight: '500',
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
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer_text: {
        fontSize: 24,
    },
});

interface CardProps {
    item: string;
}

const ITEM_SRC: Record<string, ImageSourcePropType> = {
    'Зеленые яблоки': require('./img/green-apple.webp'),
    'Авокадо': require('./img/avokado.webp'),
    'Замороженый шпинат': require('./img/spinach.webp'),
    'Помидоры': require('./img/tomato.webp'),
    'Огурцы': require('./img/cucember.webp'),
    'Лимон': require('./img/lemon.webp'),
    'Чеснок': require('./img/garlick.webp'),
    'Клубника': require('./img/strawberry.webp'),
    'Малина': require('./img/raspberry.webp'),
    'Черника': require('./img/blueberries.webp'),
    'Молоко': require('./img/milk.webp'),
    'Кабачок': require('./img/eggplant.webp'),
    'Лайм': require('./img/lime.webp'),
    'Красные яблоки': require('./img/red-apple.webp'),
};

const ITEM_PRICE: Record<string, string> = {
    'Зеленые яблоки': '100',
    'Авокадо': '300',
    'Замороженый шпинат': '50',
    'Помидоры': '123',
    'Огурцы': '321',
    'Лимон': '721',
    'Чеснок': '1',
    'Клубника': '901',
    'Малина': '1293',
    'Черника': '139',
    'Молоко': '218',
    'Кабачок': '743',
    'Лайм': '101',
    'Красные яблоки': '13',
}

const Card = ({ item }: CardProps) => {
    const { ctrl } = React.useContext(Ctx);

    return (
        <View
            style={styles.item}
            onTouchStart={() => ctrl.onItemChoose(item)}
        >
            <Image source={ITEM_SRC[item]} resizeMode='contain' style={styles.item_img}/>
            <Text style={styles.item_text}>
                {item}
            </Text>
            <View>
                <Text style={styles.price}>
                    {ITEM_PRICE[item] || '123'} ₽
                </Text>
            </View>
        </View>
    );
};


export const RecommendationPage = observer(() => {
    const { store, ctrl } = React.useContext(Ctx);
    const { items } = store;

    return (
        <SafeAreaView>
            <StatusBar barStyle='light-content'/>

            <ImageBackground
                source={require('./img/background.png')}
                style={styles.background}
            />

            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.header_text}>
                        Специально для вас
                    </Text>
                    <Image source={require('./img/logo.png')}/>
                </View>

                {store.isChoosingUrl
                    ? (
                        <View style={styles.socketUrlForm}>
                            <TextInput
                                style={{ width: 300, backgroundColor: 'white' }}
                                placeholder='Enter url'
                                onChangeText={store.setUrl}
                                value={store.url}
                            />
                            <Button
                                title='Connect'
                                onPress={() => ctrl.setWebsocketUrl(store.url)}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.items}>
                            {items && items.map(item => <Card key={item} item={item}/>)}
                            {!items && (
                                <Text>
                                    Loading...
                                </Text>
                            )}
                        </View>
                    )}
    
                <View style={styles.footer}>
                    <Text style={styles.footer_text}>
                        *Детали персональнального предложения уточните у продавца
                    </Text>
                    <Button title='Change url' onPress={() => store.setIsChoosingUrl(true)}/>
                </View>

            </View>
        </SafeAreaView>
    )
});
