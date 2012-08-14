<?php

namespace DGM\Models;

class Budget extends Model implements \JsonSerializable
{

    private $defense = 0;
    private $health = 0;
    private $immigration = 0;
    private $welfare = 0;
    private $taxBreaks = 0;
    private $agriculture = 0;
    private $education = 0;
    private $energy = 0;

    public function __construct(array $data = array())
    {
        if ($data) {
            $this->fromArray($data);
        }
    }

    public function fromArray(array $data)
    {
        if ($data) {
            $this->defense     = $data['defense'];
            $this->health      = $data['health'];
            $this->immigration = $data['immigration'];
            $this->welfare     = $data['welfare'];
            $this->taxBreaks   = $data['taxBreaks'];
            $this->agriculture = $data['agriculture'];
            $this->education   = $data['education'];
            $this->energy      = $data['energy'];
        }
    }

    public function toArray()
    {
        return [
            "defense"     => $this->defense,
            "health"      => $this->health,
            "immigration" => $this->immigration,
            "welfare"     => $this->welfare,
            "taxBreaks"   => $this->taxBreaks,
            "agriculture" => $this->agriculture,
            "education"   => $this->education,
            "energy"      => $this->energy
        ];
    }

    public function jsonSerialize()
    {
        return $this->toArray();
    }

    public function getDefense()
    {
        return $this->defense;
    }

    public function setDefense($amount)
    {
        $this->defense = $amount;
        return $this;
    }

    public function getHealth()
    {
        return $this->health;
    }

    public function setHealth($amount)
    {
        $this->health = $amount;
        return $this;
    }

    public function getImmigration()
    {
        return $this->immigration;
    }

    public function setImmigration($amount)
    {
        $this->immigration = $amount;
        return $this;
    }

    public function getWelfare()
    {
        return $this->welfare;
    }

    public function setWelfare($amount)
    {
        $this->welfare = $amount;
        return $this;
    }

    public function getTaxBreaks()
    {
        return $this->taxBreaks;
    }

    public function setTaxBreaks($amount)
    {
        $this->taxBreaks = $amount;
        return $this;
    }

    public function getAgriculture()
    {
        return $this->agriculture;
    }

    public function setAgriculture($amount)
    {
        $this->agriculture = $amount;
        return $this;
    }

    public function getEducation()
    {
        return $this->education;
    }

    public function setEducation($amount)
    {
        $this->education = $amount;
        return $this;
    }

    public function getEnergy()
    {
        return $this->energy;
    }

    public function setEnergy($amount)
    {
        $this->energy = $amount;
        return $this;
    }

}