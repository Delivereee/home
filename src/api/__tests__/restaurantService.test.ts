import { getNearbyRestaurants } from '../restaurantService';
import { RestaurantSearchParams } from '../../types/restaurant';

// 원래는 테스트 프레임워크와 모킹을 사용하지만, 여기서는 간단한 테스트로 작성
describe('restaurantService', () => {
  describe('getNearbyRestaurants', () => {
    // 기본 위치 파라미터
    const baseParams: RestaurantSearchParams = {
      lat: 37.4851031,
      lng: 126.938360
    };

    test('전체 음식점 조회', async () => {
      const restaurants = await getNearbyRestaurants(baseParams);
      
      // 결과가 배열인지 확인
      expect(Array.isArray(restaurants)).toBe(true);
      // 비어있지 않은지 확인
      expect(restaurants.length).toBeGreaterThan(0);
    });

    test('카테고리별 음식점 조회', async () => {
      // 한식 카테고리로 조회
      const params: RestaurantSearchParams = {
        ...baseParams,
        category: '한식'
      };
      
      const restaurants = await getNearbyRestaurants(params);
      
      // 결과가 배열인지 확인
      expect(Array.isArray(restaurants)).toBe(true);
      
      // 모든 음식점이 한식 카테고리에 속하는지 확인
      restaurants.forEach(restaurant => {
        expect(restaurant.categories.includes('한식')).toBe(true);
      });
    });

    test('체인점 음식점 조회', async () => {
      // 번쩍피자 체인으로 조회
      const params: RestaurantSearchParams = {
        ...baseParams,
        franchiseId: 'WIySQB3n'
      };
      
      const restaurants = await getNearbyRestaurants(params);
      
      // 결과가 배열인지 확인
      expect(Array.isArray(restaurants)).toBe(true);
      
      // 모든 음식점이 해당 체인점 ID로 시작하는지 확인
      restaurants.forEach(restaurant => {
        expect(restaurant.id.startsWith('WIySQB3n')).toBe(true);
      });
    });

    test('카테고리와 체인점 조합 조회', async () => {
      // 번쩍피자 체인의 프랜차이즈 카테고리 음식점 조회
      const params: RestaurantSearchParams = {
        ...baseParams,
        franchiseId: 'WIySQB3n',
        category: '프랜차이즈'
      };
      
      const restaurants = await getNearbyRestaurants(params);
      
      // 결과가 배열인지 확인
      expect(Array.isArray(restaurants)).toBe(true);
      
      // 모든 음식점이 해당 조건을 만족하는지 확인
      restaurants.forEach(restaurant => {
        expect(restaurant.id.startsWith('WIySQB3n')).toBe(true);
        expect(restaurant.categories.includes('프랜차이즈')).toBe(true);
      });
    });
  });
}); 