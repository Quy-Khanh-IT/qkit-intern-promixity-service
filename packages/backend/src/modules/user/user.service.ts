import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findOneById('655ab2ba456d22a01c27972c');
  }

  async update() {
    return this.userRepository.update('655ab2ba456d22a01c27972c', {
      user_nickname: 'NATNGoc nênnenenenene',
    });
  }

  async delete() {
    return this.userRepository.delete('655ab2ba456d22a01c27972c');
  }

  async create(): Promise<User> {
    return await this.userRepository.create({
      user_nickname: 'NATNgocss',
      user_email: '21522sss37ssss29@gm.uit.edu.vn',
      user_password:
        '$2b$10$nVAe45p3XZPA1qXAc4qmnO1z6ZXFoEJbhp16IiobeckPfaT.k2DDC',
      user_profilePhotoURL:
        'https://viso.ai/wp-content/uploads/2021/01/data-science-artificial-intelligence-machine-learning-vs-deep-learning.png',
      user_website: 'https://www.facebook.com/profile.php?id=100024562028779',
      user_bio: 'Đơn giản là thuw thôi',
      user_favorite_posts: [],
      user_following_count: 0,
      user_follower_count: 0,
      user_gender: 'male',
      role: 'user',
    });
  }
}
