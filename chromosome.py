#!/usr/bin/env python
#
#   This work is free. You can redistribute it and/or modify it under the
#   terms of the Do What The Fuck You Want To Public License, Version 2,
#   as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
#

import random


class Chromosome:
    def __init__(self, sequence):
        self.chromosome = sequence
        self.cost = self.getCost()

    @classmethod
    def fromParents(cls, parent_one, parent_two):
        if (len(parent_one) != len(parent_two)):
            return "Error"

        if (parent_one == parent_two):
            parent_two = Chromosome.random(len(parent_two))

        possible = [i for i in range(len(parent_one))]
        current = [-1 for i in range(len(parent_one))]

        for i in range(len(parent_one)):
            if (parent_one[i] == parent_two[i]):
                current[i] = parent_one[i]
                possible.remove(current[i])
        for i in range(len(parent_one)):
            if (current[i] == -1):
                current[i] = random.choice(possible)
                possible.remove(current[i])

        return cls(current)

    @classmethod
    def random(cls, num_queens=8):
        chromosome = [i for i in range(num_queens)]
        random.shuffle(chromosome)
        return cls(chromosome)

    def getCost(self):
        cost = 0;
        for i in range(len(self.chromosome)):
            cost += self.chromosome.count(self.chromosome[i]) - 1
            cost += self.getDiagonalCost(i)
        return cost

    def getDiagonalCost(self, index):
        cost = 0
        for i in range(len(self.chromosome)):
            if (i != index):
                delta_x = abs(index - i)
                delta_y = abs(self.chromosome[index] - self.chromosome[i])
                if (delta_x == delta_y):
                    cost = cost + 1
        return cost

    def mutate(self, mutation_prob=.001):
        if (random.random() < mutation_prob):
            indexOne = random.randint(0, len(self) - 1)
            indexTwo = random.randint(0, len(self) - 1)
            temp = self.chromosome[indexOne]
            self.chromosome[indexOne] = self.chromosome[indexTwo]
            self.chromosome[indexTwo] = temp

    def __str__(self):
        return "{} Cost: {}".format(self.chromosome, self.cost)

    def __repr__(self):
        return str(self.chromosome)

    def __cmp__(self, other):
        return self.cost.__cmp__(other.cost)

    def __len__(self):
        return len(self.chromosome)

    def __getitem__(self, index):
        return self.chromosome[index]

    def __setitem__(self, index, value):
        self.chromosome[index] = value


if __name__ == "__main__":
    print Chromosome([4, 2, 0, 6, 1, 7, 5, 3])
    parent_one = Chromosome.random()
    parent_two = Chromosome.random()
    print "Parent One: " + str(parent_one)
    print "Parent Two: " + str(parent_two)
    print Chromosome.fromParents(parent_one, parent_two)